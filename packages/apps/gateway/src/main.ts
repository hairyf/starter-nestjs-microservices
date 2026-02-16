import { NestFactory } from '@nestjs/core'
import { withNestjsListen, withNestjsSwagger } from '@service/core'
import { service } from '../package.json'
import { AppModule } from './app.module'

async function main() {
  const app = await NestFactory.create(AppModule)

  withNestjsSwagger(app, config => config
    .setTitle('Website')
    .setDescription('The website API')
    .setVersion('1.0'))
  withNestjsListen(app, service.port)
}

main()
