---
name: bootstrap-setup
description: Application initialization and startup utilities for NestJS microservices
---

# Bootstrap Setup

## Usage

Bootstrap utilities come from **nestjs-extras-w** (listen, Swagger, CORS, BigInt/decimal repair) and **nestjs-mickit** (microservice connection).

```typescript
import { NestFactory } from '@nestjs/core'
import {
  withDecimalRepair,
  withNestjsCors,
  withNestjsSwagger,
  startNestjsListen,
} from 'nestjs-extras-w'
import { startNestjsMicroservice } from 'nestjs-mickit'
import { microservice, service } from './package.json'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Fix BigInt/decimal serialization issues
  withDecimalRepair(app)

  // Setup Swagger documentation
  withNestjsSwagger(app, config => config
    .setTitle('Website')
    .setDescription('The website API')
    .setVersion('1.0'))

  // Enable CORS
  withNestjsCors(app)

  // Connect microservice (if configured in package.json)
  await startNestjsMicroservice(app, microservice)

  // Start HTTP server
  await startNestjsListen(app, service)
}

bootstrap()
```

## Key Functions

### `startNestjsMicroservice(app, microservice)` (nestjs-mickit)

Connects a microservice to the application based on `package.json` microservice configuration.

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

### `startNestjsListen(app, service)` (nestjs-extras-w)

Starts the HTTP server with automatic port fallback (uses `service` from package.json).

**Features:**
- If port is in use, automatically tries `port + 1`
- Logs service URL, Swagger URL, and environment
- Handles graceful shutdown on SIGINT

### `withNestjsSwagger(app, setup)` (nestjs-extras-w)

Configures Swagger API documentation.

**Default paths:**
- UI: `/swagger/website`
- JSON: `/swagger/json`

### `withNestjsCors(app)` (nestjs-extras-w)

Enables CORS with permissive defaults for development.

**Default configuration:**
- Allows all origins (`origin: true`)
- Supports common HTTP methods
- Includes credentials

### `withDecimalRepair(app)` (nestjs-extras-w)

Fixes BigInt/decimal serialization for JSON responses.

## Key Points

* **Order matters**: Call `startNestjsMicroservice` before `startNestjsListen` to ensure microservices are ready
* **Environment expansion**: Use `$VARIABLE_NAME` syntax in package.json for environment variable substitution
* **Port fallback**: The listen function automatically handles port conflicts, useful in development
* **Microservice optional**: If `microservice` is not defined in package.json, handle accordingly in your bootstrap
