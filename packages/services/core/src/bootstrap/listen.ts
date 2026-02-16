import type { INestApplication } from '@nestjs/common'
import process from 'node:process'
import { styleText } from 'node:util'
import { delay, to } from '@hairy/utils'
import { Logger } from '@nestjs/common'
import { app as appConfig } from '../constants'
import { swagger } from './swagger'

const logger = new Logger()

export async function withNestjsListen(app: INestApplication, port: string | number = process.env.SERVER_PORT || 3000) {
  const [error] = await to(app.listen(port))

  if (error) {
    logger.error(`Port ${port} is in use, trying ${+port + 1}...`)
    await delay(1000)
    await withNestjsListen(app, +port + 1)
    return
  }
  appConfig.instance = app
  appConfig.port = port
  process.on('SIGINT', () => close(app))
  loggerListen()
}

function loggerListen() {
  if (appConfig.microservice)
    logger.log(`${styleText('bold', 'Microservice:')}  ${styleText('gray', 'Enabled')}`)

  logger.log(`${styleText('bold', 'Listening on: ')} ${styleText('gray', appConfig.url ?? '')}`)

  if (swagger)
    logger.log(`${styleText('bold', 'Swagger URL:  ')} ${styleText('gray', `${appConfig.url}/swagger/website`)}`)

  if (process.env.NODE_ENV)
    logger.log(`${styleText('bold', 'Environment:  ')} ${styleText('gray', process.env.NODE_ENV)}`)
}

async function close(app: INestApplication) {
  await app.close()
  logger.log(`${styleText('bold', 'Server:')} ${styleText('gray', 'Closed')}`)
  process.exit(0)
}
