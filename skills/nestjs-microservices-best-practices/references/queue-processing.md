---
name: queue-processing
description: Bull queue integration for background job processing
---

# Queue Processing

## Usage

### Module Setup

Register queues in your module:

```typescript
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { redis } from '@service/redis'

@Module({
  imports: [
    BullModule.forRoot({
      redis: redis.enable
        ? {
            host: redis.options.host,
            port: redis.options.port,
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
          }
        : undefined,
    }),
    BullModule.registerQueue({ name: 'calc' }),
    BullModule.registerQueue({ name: 'email' }),
  ],
})
export class QueueModule {}
```

### Queue Service

Create a service to interact with queues:

```typescript
import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull'
import type { Queue } from 'bull'

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('calc') private calcQueue: Queue,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async addCalcJob(data: { message: string, userId: number }) {
    const job = await this.calcQueue.add('calc', {
      ...data,
      timestamp: Date.now(),
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    })

    return {
      jobId: job.id,
      message: 'Calc task added to queue',
    }
  }

  async getJob(queueName: 'calc' | 'email', jobId: string) {
    const queue = this[`${queueName}Queue`]
    return queue.getJob(jobId)
  }

  async getJobs(queueName: 'calc' | 'email') {
    const queue = this[`${queueName}Queue`]
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ])

    return { waiting, active, completed, failed, delayed }
  }
}
```

### Job Processor

Create processors to handle queue jobs:

```typescript
import { Logger } from '@nestjs/common'
import { Process, Processor } from '@nestjs/bull'
import type { Job } from 'bull'

interface CalcJobData {
  message: string
  userId: number
  timestamp: number
}

@Processor('calc')
export class CalcProcessor {
  private readonly logger = new Logger(CalcProcessor.name)

  @Process('calc')
  async handleCalcJob(job: Job<CalcJobData>) {
    this.logger.log(`Start calculating ${job.id}`)

    // Update progress
    await job.progress(50)

    // Do work
    await new Promise(resolve => setTimeout(resolve, 2000))

    this.logger.log(`Task ${job.id} completed`)

    return {
      success: true,
      jobId: job.id,
      processedAt: new Date().toISOString(),
    }
  }
}
```

### Controller Integration

Use queues in controllers:

```typescript
import { Body, Controller, Post } from '@nestjs/common'
import { QueueService } from './queue.service'

@Controller('queue')
export class QueueController {
  constructor(private queue: QueueService) {}

  @Post('calc')
  async addCalcJob(@Body() data: { message: string, userId: number }) {
    return this.queue.addCalcJob(data)
  }
}
```

## Job Options

### Retry Configuration

```typescript
await queue.add('task', data, {
  attempts: 3,                    // Max retry attempts
  backoff: {
    type: 'exponential',          // or 'fixed'
    delay: 2000,                  // Initial delay in ms
  },
  removeOnComplete: true,         // Remove completed jobs
  removeOnFail: false,            // Keep failed jobs for inspection
})
```

### Job Progress

```typescript
@Process('task')
async handleJob(job: Job<any>) {
  await job.progress(25)  // 25% complete
  // ... work ...
  await job.progress(50)  // 50% complete
  // ... work ...
  await job.progress(100) // 100% complete
}
```

## Key Points

* **Redis required**: Bull queues require Redis connection (use `@service/redis`)
* **Queue naming**: Queue names must match between `registerQueue()` and `@Processor()`
* **Job types**: Use different job names (second parameter to `add()`) for different processors
* **Progress tracking**: Use `job.progress()` for long-running tasks
* **Error handling**: Failed jobs are kept by default for debugging
* **Concurrency**: Processors handle jobs concurrently by default

## Queue States

Jobs can be in one of these states:

- **waiting**: Queued but not yet processed
- **active**: Currently being processed
- **completed**: Successfully finished
- **failed**: Failed after all retry attempts
- **delayed**: Scheduled for future execution

Access these states via `queue.getWaiting()`, `queue.getActive()`, etc.
