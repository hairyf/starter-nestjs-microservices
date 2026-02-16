---
name: error-handling
description: Error handling patterns for microservices
---

# Error Handling

## Usage

### Global Unhandled Rejection Handler

For services that run background tasks (like schedulers), handle unhandled promise rejections:

```typescript
import process from 'node:process'

// Global handler for unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  // Handle specific error types
  if (reason instanceof Error && reason.message.includes('Failed to acquire lock')) {
    // Silently handle lock acquisition failures (expected behavior)
    return
  }

  // Log other errors without crashing
  if (reason instanceof Error) {
    console.error('Unhandled Promise Rejection:', reason.message, reason.stack)
  } else {
    console.error('Unhandled Promise Rejection:', reason)
  }
})
```

### Microservice Error Handling

Errors in microservice handlers are automatically serialized and sent back:

```typescript
@MessagePattern('calc')
async accumulate(@Payload() nums: number[]): Promise<number> {
  if (!nums || nums.length === 0) {
    throw new Error('Numbers array cannot be empty')
  }

  try {
    return nums.reduce((pre, cur) => pre + cur, 0)
  } catch (error) {
    // Errors are automatically sent to client
    throw new Error(`Calculation failed: ${error.message}`)
  }
}
```

### Client-Side Error Handling

Handle errors when calling microservices:

```typescript
@Post('microservice/calc')
async callService(@Body() nums: number[]) {
  try {
    return await this.client.send<number>('calc', nums).toPromise()
  } catch (error) {
    // Handle microservice errors
    if (error.message?.includes('Numbers array cannot be empty')) {
      throw new BadRequestException('Invalid input')
    }
    throw new InternalServerErrorException('Service unavailable')
  }
}
```

### Queue Job Error Handling

Bull queues provide built-in retry mechanisms:

```typescript
@Processor('email')
export class EmailProcessor {
  @Process('send')
  async handleEmailJob(job: Job<EmailData>) {
    try {
      await this.sendEmail(job.data)
      return { success: true }
    } catch (error) {
      // Job will be retried based on queue configuration
      this.logger.error(`Email job ${job.id} failed:`, error)
      throw error  // Re-throw to trigger retry
    }
  }
}
```

Configure retry behavior:

```typescript
await queue.add('send', data, {
  attempts: 3,              // Retry 3 times
  backoff: {
    type: 'exponential',
    delay: 2000,            // Start with 2s delay
  },
  removeOnFail: false,     // Keep failed jobs for inspection
})
```

## Error Patterns

### Validation Errors

```typescript
import { BadRequestException } from '@nestjs/common'

@MessagePattern('create-user')
async createUser(@Payload() data: CreateUserDto) {
  if (!data.email) {
    throw new BadRequestException('Email is required')
  }

  if (!isValidEmail(data.email)) {
    throw new BadRequestException('Invalid email format')
  }

  return this.userService.create(data)
}
```

### Service Unavailable

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class ExternalService {
  private isAvailable = false

  async onModuleInit() {
    try {
      await this.checkHealth()
      this.isAvailable = true
    } catch {
      this.isAvailable = false
    }
  }

  async call() {
    if (!this.isAvailable) {
      throw new ServiceUnavailableException('External service is down')
    }
    // ...
  }
}
```

### Timeout Handling

```typescript
import { timeout, catchError } from 'rxjs/operators'
import { throwError } from 'rxjs'

@Post('microservice/calc')
callService(@Body() nums: number[]) {
  return this.client.send<number>('calc', nums).pipe(
    timeout(5000),  // 5 second timeout
    catchError(error => {
      if (error.name === 'TimeoutError') {
        throw new RequestTimeoutException('Service timeout')
      }
      throw error
    }),
  )
}
```

## Key Points

* **Automatic serialization**: Microservice errors are automatically serialized and sent to clients
* **Retry mechanisms**: Use Bull queue retry options for background jobs
* **Graceful degradation**: Handle service unavailability gracefully
* **Error logging**: Log errors with context (job ID, request ID, etc.)
* **Timeout protection**: Set timeouts for external service calls
* **Specific exceptions**: Use NestJS exception types for proper HTTP status codes
* **Unhandled rejections**: Handle background task errors to prevent process crashes

## Best Practices

1. **Log with context**: Include request/job IDs in error logs
2. **Don't crash on expected errors**: Lock failures, validation errors are expected
3. **Use appropriate exception types**: `BadRequestException`, `NotFoundException`, etc.
4. **Retry transient failures**: Network errors, temporary service unavailability
5. **Fail fast on permanent errors**: Invalid input, authentication failures
6. **Monitor error rates**: Track error patterns for system health
