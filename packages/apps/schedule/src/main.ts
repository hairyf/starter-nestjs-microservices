import { NestFactory } from '@nestjs/core'
import {
  startNestjsListen,
  withDecimalRepair,
  withNestjsCors,
  withNestjsSwagger,
} from 'nestjs-extras-w'
import { service } from '../package.json'
import { AppModule } from './app.module'
import { withUnhandledRejection } from './main.strap'

async function main() {
  const app = await NestFactory.create(AppModule)

  withUnhandledRejection()
  withDecimalRepair(app)
  withNestjsSwagger(app, config => config
    .setTitle('Website')
    .setDescription('The website API')
    .setVersion('1.0'))
  withNestjsCors(app)

  await startNestjsListen(app, service)
}

main()
