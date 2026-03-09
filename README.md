# NestJS Starter - Microservices

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

A modern microservices architecture built with NestJS, providing a flexible and scalable foundation for building distributed applications.

## 📋 Overview

This project implements a complete microservices ecosystem using NestJS, with the following key components:

- **Gateway Service**: Routes requests to appropriate microservices (port 3000)
- **Provider Service**: Handles provider-specific business logic (port 4000)
- **Schedule Service**: Manages scheduling operations (port 5000)

## 🚀 Features

- Gateway-based architecture with microservices communication
- Automatic service discovery and registration
- Swagger API documentation
- Multi-database support with Prisma
- Built-in scheduling capabilities
- Comprehensive tooling for microservices development

## 🏗️ Project Structure

```
packages/
├── apps/                  # Applications
│   ├── gateway/           # Main API gateway
│   ├── provider/          # Provider microservice
│   └── schedule/          # Scheduling microservice
└── services/              # Shared services
    ├── databases/         # Database configurations and clients
    └── redis/             # Redis integration
docker/                    # Docker config (compose & build)
├── docker-compose.deploy.yml   # Microservices deployment (gateway / provider / schedule)
├── docker-compose.service.yml  # Dev dependencies (PostgreSQL, Redis)
├── deploy.dockerfile           # Multi-app build image
└── .dockerignore
```

## 🛠️ Prerequisites

Before that, you need to meet the following conditions:

- Node.js 20+
- pnpm 10+

## Setup

```sh
# 1. Create environment file
cp .env.example .env
# Edit .env file as needed(if prod)

# 2. Start docker compose service
docker-compose --env-file .env -f docker/docker-compose.service.yml up -d

# 3. Install dependencies
pnpm install
```

## Running the Application

```bash
# Development mode (watch)
pnpm dev # all services
cd packages/apps/gateway && pnpm dev # only gateway service

# Production run
pnpm start # all services
cd packages/apps/gateway && pnpm start # only gateway service
```

## ⚙️ Configuration

The global `.env` file contains environment variables shared by all services, while each service directory’s `.env` file is dedicated to that specific service. The service-level `.env` has higher priority than the global `.env` file and will be loaded to override the global settings.

```
packages/apps/gateway/.env  # Gateway service environment variables
.env                        # Global environment variables
```

## 💻 Development Guide

### Service Configuration

Each application defines its service configuration in its `package.json` file:

```json
{
  "microservice": {
    "transport": "REDIS",
    "options": {
      "host": "$REDIS_HOST",
      "port": "$REDIS_PORT"
    }
  },
  "service": {
    "host": "localhost",
    "port": 4000
  }
}
```

### Creating a New Microservice

1. Create a new directory in `packages/apps/`
2. Add a `package.json` with the required configuration
3. Create the main entry file and module file

Example main entry file:
```typescript
// main.ts
import { NestFactory } from '@nestjs/core'
import { startNestjsListen } from 'nestjs-extras-w'
import { startNestjsMicroservice } from 'nestjs-mickit'
import { microservice, service } from './package.json'
import { YourServiceModule } from './your-service.module'

async function bootstrap() {
  const app = await NestFactory.create(YourServiceModule)
  await startNestjsMicroservice(app, microservice)
  await startNestjsListen(app, service)
}

bootstrap()
```

### Microservices Communication

Services communicate using NestJS's built-in microservices capabilities:

```ts
import { BullModule } from '@nestjs/bull'
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { redis } from '@service/redis'
import { microservices } from 'nestjs-mickit'
import { AppController } from './app.controller'
import { QueueModule } from './modules'

@Module({
  controllers: [AppController],
  imports: [
    ClientsModule.register(microservices()),
    QueueModule,
  ],
})

export class AppModule {}
```

**Sending Messages**:

```typescript
@Controller()
export class AppController {
  constructor(@Inject('@service/your-service') private client: ClientProxy) {}

  callService(data: any) {
    return this.client.send('pattern', data) // Request-response
  }
}
```

**Receiving Messages**:

```typescript
@Controller()
export class YourServiceController {
  @MessagePattern('pattern')
  handleMessage(@Payload() data: any) {
    return result
  }
}
```

## 📄 License

[MIT](LICENSE.md)
