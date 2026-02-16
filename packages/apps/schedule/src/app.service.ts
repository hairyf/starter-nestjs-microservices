import type { ClientProxy } from '@nestjs/microservices'
import { Inject, Injectable } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { Redlock } from 'nestjs-redlock-universal'

@Injectable()
export class AppService {
  constructor(
    @Inject('@service/provider') private client: ClientProxy,
  ) {}

  @Interval(5000)
  @Redlock({ key: 'schedule', debug: true, ttl: 1000 })
  async redlock() {
    await new Promise(resolve => setTimeout(resolve, 5000))
    this.client.emit('schedule', `Test Schedule Send Other Provider, Time: ${new Date().toISOString()}`)
  }
}
