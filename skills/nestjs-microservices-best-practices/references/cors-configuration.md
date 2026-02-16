---
name: cors-configuration
description: Cross-origin resource sharing setup for NestJS applications
---

# CORS Configuration

## Usage

### Basic Setup

```typescript
import { NestFactory } from '@nestjs/core'
import { withNestjsCors } from '@service/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  withNestjsCors(app)

  await app.listen(3000)
}

bootstrap()
```

## Default Configuration

The `withNestjsCors` function applies permissive CORS settings suitable for development:

```typescript
{
  methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token',
  exposedHeaders: 'Content-Length, X-Custom-Header',
  origin: true,           // Allows all origins
  credentials: true,      // Allows cookies/credentials
}
```

Additionally, it sets headers manually for broader compatibility:

```typescript
res.header('Access-Control-Allow-Origin', '*')
res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS')
res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, token')
res.header('Access-Control-Expose-Headers', 'Content-Length, X-Custom-Header')
```

## Custom Configuration

For production, use NestJS's built-in CORS with custom options:

```typescript
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: ['https://example.com', 'https://app.example.com'],
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
    maxAge: 3600,
  })

  await app.listen(3000)
}

bootstrap()
```

## Key Points

* **Development defaults**: `withNestjsCors` uses permissive settings for development
* **Production override**: Replace with restrictive settings in production
* **Dual approach**: Function uses both NestJS CORS and manual headers for compatibility
* **Credentials**: Default enables credentials (cookies, authorization headers)
* **Custom headers**: Supports custom headers like `token` in allowed headers
* **Exposed headers**: Allows clients to read `Content-Length` and custom headers

## Security Considerations

For production:

1. **Restrict origins**: Use specific domain list instead of `*` or `true`
2. **Limit methods**: Only allow necessary HTTP methods
3. **Minimize headers**: Only include required headers
4. **Credentials**: Only enable if necessary (requires specific origin, not `*`)

```typescript
app.enableCors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,  // Requires specific origin, not '*'
})
```
