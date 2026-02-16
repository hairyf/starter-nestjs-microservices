import type { Job } from 'bull'
import { Process, Processor } from '@nestjs/bull'
import { Logger } from '@nestjs/common'

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
    this.logger.log(`Data: ${JSON.stringify(job.data)}`)

    // Mock async work
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Update task progress
    await job.progress(50)

    // Mock more work
    await new Promise(resolve => setTimeout(resolve, 2000))

    this.logger.log(`Task ${job.id} completed`)

    return {
      success: true,
      jobId: job.id,
      processedAt: new Date().toISOString(),
      message: `Calculated ${job.data.message}`,
    }
  }
}
