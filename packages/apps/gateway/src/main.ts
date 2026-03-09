import { NestFactory } from '@nestjs/core'
import { startNestjsListen, withNestjsSwagger } from 'nestjs-extras-w'
import { service } from '../package.json'
import { AppModule } from './app.module'

async function main() {
  const app = await NestFactory.create(AppModule)

  withNestjsSwagger(app, config => config
    .setTitle('Website')
    .setDescription('The website API')
    .setVersion('1.0'))
  startNestjsListen(app, service)
}

main()
