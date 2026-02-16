import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { ScheduleModule as NestjsScheduleModule } from '@nestjs/schedule'
import { microservices } from '@service/core'
import { redis } from '@service/redis'
import { IoredisAdapter, RedlockModule } from 'nestjs-redlock-universal'
import { AppService } from './app.service'

@Module({
  imports: [
    NestjsScheduleModule.forRoot(),
    ClientsModule.register(microservices()),
    RedlockModule.forRoot({
      nodes: [new IoredisAdapter(redis)],
      defaultTtl: 30000,
    }),
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
