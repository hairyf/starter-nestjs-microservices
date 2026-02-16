import type { INestApplication } from '@nestjs/common'
import { merge } from '@hairy/utils'
import { Transport } from '@nestjs/microservices'
import { app as appConfig } from '../constants'
import { parseWithEnvExpand } from '../utils'

export async function withNestjsMicroservice(app: INestApplication, service?: any) {
  if (!service || !service.microservice)
    return

  const options = merge(service.microservice, {
    transport: Transport[service.microservice.transport],
    options: parseWithEnvExpand(service.microservice.options),
  })

  const microservice = app.connectMicroservice(options)

  appConfig.microservice = { ...options, instance: microservice }
  await app.startAllMicroservices()
}
