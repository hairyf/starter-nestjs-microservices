import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger'
import { QueueService } from './modules'

@Controller()
@ApiTags('app-controller')
export class AppController {
  constructor(
    @Inject('@service/provider') private client: ClientProxy,
    private queue: QueueService,
  ) {}

  @Post('microservice/calc')
  @ApiBody({ type: [Number] })
  callService(@Body() nums: number[]) {
    return this.client.send<number>('calc', nums)
  }

  @Post('queue/calc')
  @ApiOperation({ summary: 'Add calc task to queue' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Hello Bull Queue' },
        userId: { type: 'number', example: 123 },
      },
      required: ['message', 'userId'],
    },
  })
  async addCalcJob(@Body() data: { message: string, userId: number }) {
    return this.queue.addCalcJob(data)
  }

  @Post('queue/send-email')
  @ApiOperation({ summary: 'Add email send task to queue' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        to: { type: 'string', example: 'user@example.com' },
        subject: { type: 'string', example: 'Test Email' },
        content: { type: 'string', example: 'This is a test email' },
      },
      required: ['to', 'subject', 'content'],
    },
  })
  async addEmailJob(@Body() data: { to: string, subject: string, content: string }) {
    return this.queue.addEmailJob(data)
  }

  @Get('queue/job')
  @ApiOperation({ summary: 'Get job status' })
  @ApiQuery({ name: 'name', description: 'Queue name', enum: ['calc', 'email'] })
  @ApiQuery({ name: 'jobId', description: 'Job ID' })
  async getJobStatus(@Query('name') name: 'calc' | 'email', @Query('jobId') jobId: string) {
    return this.queue.getJob(name, jobId)
  }

  @Get('queue/jobs')
  @ApiOperation({ summary: 'Get all jobs status' })
  @ApiQuery({ name: 'name', description: 'Queue name', enum: ['calc', 'email'] })
  async getJobs(@Query('name') name: string) {
    return this.queue.getJobs(name as 'calc' | 'email')
  }
}
