---
name: bootstrap-setup
description: Application initialization and startup utilities for NestJS microservices
---

# Bootstrap Setup

## Usage

The `@service/core` package provides bootstrap utilities for setting up NestJS applications with microservices support.

```typescript
import { NestFactory } from '@nestjs/core'
import {
  withNestjsBigintRepair,
  withNestjsCors,
  withNestjsListen,
  withNestjsMicroservice,
  withNestjsSwagger,
} from '@service/core'
import { service } from './package.json'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Fix BigInt serialization issues
  withNestjsBigintRepair(app)

  // Setup Swagger documentation
  withNestjsSwagger(app, config => config
    .setTitle('Website')
    .setDescription('The website API')
    .setVersion('1.0'))

  // Enable CORS
  withNestjsCors(app)

  // Connect microservice (if configured in package.json)
  await withNestjsMicroservice(app, service)

  // Start HTTP server
  await withNestjsListen(app, service.port)
}

bootstrap()
```

## Key Functions

### `withNestjsMicroservice(app, service)`

Connects a microservice to the application based on `package.json` service configuration.

**Configuration in package.json:**
```json
{
  "service": {
    "microservice": {
      "transport": "REDIS",
      "options": {
        "host": "$REDIS_HOST",
        "port": "$REDIS_PORT"
      }
    },
    "port": 4000
  }
}
```

**Behavior:**
- Automatically parses environment variables in options (e.g., `$REDIS_HOST`)
- Converts transport string to NestJS Transport enum
- Starts all microservices after connection

### `withNestjsListen(app, port)`

Starts the HTTP server with automatic port fallback.

**Features:**
- If port is in use, automatically tries `port + 1`
- Logs service URL, Swagger URL, and environment
- Handles graceful shutdown on SIGINT

### `withNestjsSwagger(app, setup)`

Configures Swagger API documentation.

**Default paths:**
- UI: `/swagger/website`
- JSON: `/swagger/json`

### `withNestjsCors(app)`

Enables CORS with permissive defaults for development.

**Default configuration:**
- Allows all origins (`origin: true`)
- Supports common HTTP methods
- Includes credentials

### `withNestjsBigintRepair(app)`

Fixes BigInt serialization for JSON responses. Currently requires external decimal library parameter.

## Key Points

* **Order matters**: Call `withNestjsMicroservice` before `withNestjsListen` to ensure microservices are ready
* **Environment expansion**: Use `$VARIABLE_NAME` syntax in package.json for environment variable substitution
* **Port fallback**: The listen function automatically handles port conflicts, useful in development
* **Microservice optional**: If `service.microservice` is not defined, the function returns early without error
