import type { INestMicroservice } from '@nestjs/common'
import type { CustomTransportStrategy, GrpcOptions, KafkaOptions, MqttOptions, NatsOptions, RedisOptions, RmqOptions, TcpOptions } from '@nestjs/microservices'

export interface CustomStrategy {
  transport?: 'custom'
  strategy: CustomTransportStrategy
  options?: Record<string, any>
}

export type MicroserviceOptions = GrpcOptions | TcpOptions | RedisOptions | NatsOptions | MqttOptions | RmqOptions | KafkaOptions | CustomStrategy

export type Microservice = (MicroserviceOptions & { instance: INestMicroservice })
