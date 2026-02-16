import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { CalcProcessor } from './processor/calc.processor'
import { EmailProcessor } from './processor/email.processor'
import { QueueService } from './queue.service'

@Module({
  imports: [
    BullModule.registerQueue({ name: 'calc' }),
    BullModule.registerQueue({ name: 'email' }),
  ],
  providers: [
    EmailProcessor,
    CalcProcessor,
    QueueService,
  ],
  exports: [
    QueueService,
  ],
})
export class QueueModule {}
