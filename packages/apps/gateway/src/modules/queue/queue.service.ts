import type { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { Injectable } from '@nestjs/common'

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

  async addEmailJob(data: { to: string, subject: string, content: string }) {
    const job = await this.emailQueue.add('send', data, {
      attempts: 3,
      removeOnComplete: true,
      removeOnFail: false,
    })

    return {
      jobId: job.id,
      message: '邮件任务已添加到队列',
    }
  }

  async getJob(name: 'calc' | 'email', jobId: string) {
    const queue = this[`${name}Queue`]
    return queue.getJob(jobId)
  }

  async getJobs(name: 'calc' | 'email') {
    const queue = this[`${name}Queue`]
    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaiting(),
      queue.getActive(),
      queue.getCompleted(),
      queue.getFailed(),
      queue.getDelayed(),
    ])

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
    }
  }
}
