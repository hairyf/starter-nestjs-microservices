import type { INestApplication } from '@nestjs/common'
import type { CorsOptions, CorsOptionsDelegate } from '@nestjs/common/interfaces/external/cors-options.interface'

export function withNestjsCors(app: INestApplication) {
  const options: boolean | CorsOptions | CorsOptionsDelegate<any> = {
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token',
    exposedHeaders: 'Content-Length, X-Custom-Header',
    origin: true,
    credentials: true,
  }

  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token')
    res.header('Access-Control-Expose-Headers', 'Content-Length, X-Custom-Header')
    next()
  })

  app.enableCors(options)
}
