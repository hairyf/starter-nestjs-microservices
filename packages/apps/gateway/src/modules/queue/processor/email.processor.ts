import type { Job } from 'bull'
import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'

@Processor('email')
export class EmailProcessor {
  private readonly logger = new Logger(EmailProcessor.name)

  @Process('send')
  async handleEmailJob(job: Job<{ to: string, subject: string, content: string }>) {
    this.logger.log(`Send email task ${job.id}`)
    this.logger.log(`Attempts made: ${job.attemptsMade}`)
    this.logger.log(`Recipient: ${job.data.to}, Subject: ${job.data.subject}`)

    // Mock send email
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (Math.random() < 0.5) {
      throw new Error('Failed to send email')
    }

    this.logger.log(`Email sent to ${job.data.to}`)

    return {
      success: true,
      to: job.data.to,
      sentAt: new Date().toISOString(),
    }
  }
}
