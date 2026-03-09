import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { redis } from '@service/redis'
import { microservices } from 'nestjs-mickit'
import { AppController } from './app.controller'
import { QueueModule } from './modules'

@Module({
  controllers: [AppController],
  imports: [
    ClientsModule.register(microservices()),
    BullModule.forRoot({
      redis: redis.enabled
        ? {
            host: redis.options.host,
            port: redis.options.port,
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
          }
        : undefined,
    }),
    QueueModule,
  ],
})

export class AppModule {}
