import { NestFactory } from '@nestjs/core'
import {
  startNestjsListen,
  withNestjsCors,
  withNestjsSwagger,
} from 'nestjs-extras-w'
import { startNestjsMicroservice } from 'nestjs-mickit'
import { microservice, service } from '../package.json'
import { AppModule } from './app.module'

async function main() {
  const app = await NestFactory.create(AppModule)

  withNestjsSwagger(app, config => config
    .setTitle('Website')
    .setDescription('The website API')
    .setVersion('1.0'))

  withNestjsCors(app)

  await startNestjsMicroservice(app, microservice)
  await startNestjsListen(app, service)
}

main()
