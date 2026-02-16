import type { INestApplication } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export let swagger: DocumentBuilder

export function withNestjsSwagger(app: INestApplication, setup?: (config: DocumentBuilder) => DocumentBuilder) {
  const config = new DocumentBuilder()

  setup?.(config)

  const document = SwaggerModule.createDocument(app, config.build())

  SwaggerModule.setup(
    'swagger/website',
    app,
    document,
    {
      jsonDocumentUrl: 'swagger/json',
    },
  )

  swagger = config
}
