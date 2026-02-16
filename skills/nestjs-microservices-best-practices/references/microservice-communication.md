---
name: microservice-communication
description: Inter-service messaging patterns and client setup for NestJS microservices
---

# Microservice Communication

## Usage

### Sending Messages (Client Side)

Register microservice clients in your module:

```typescript
import { Module } from '@nestjs/common'
import { ClientsModule } from '@nestjs/microservices'
import { microservices } from '@service/core'

@Module({
  imports: [
    ClientsModule.register(microservices()),
  ],
})
export class AppModule {}
```

Inject and use the client in controllers:

```typescript
import { Controller, Inject, Post, Body } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Controller()
export class AppController {
  constructor(
    @Inject('@service/provider') private client: ClientProxy,
  ) {}

  @Post('microservice/calc')
  callService(@Body() nums: number[]) {
    // Request-response pattern
    return this.client.send<number>('calc', nums)
    
    // Event pattern (fire and forget)
    // return this.client.emit('schedule', data)
  }
}
```

### Receiving Messages (Service Side)

Handle incoming messages in controllers:

```typescript
import { Controller } from '@nestjs/common'
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices'

@Controller()
export class AppController {
  @MessagePattern('calc')
  async accumulate(@Payload() nums: number[]): Promise<number> {
    return nums.reduce((pre, cur) => pre + cur, 0)
  }

  @EventPattern('schedule')
  async handleSchedule(@Payload() data: any) {
    // Fire and forget event handler
    console.log(data)
  }
}
```

## Advanced Client Creation

### Single Client

```typescript
import { microservice, client } from '@service/core'

// Get microservice configuration
const config = microservice('@service/provider')

// Create client directly
const providerClient = client('@service/provider')
```

### Multiple Clients

```typescript
import { clients } from '@service/core'

// Create clients for specific services
const [providerClient, scheduleClient] = clients([
  '@service/provider',
  '@service/schedule',
])
```

## Key Points

* **Service naming**: Service names must match `package.json` name field (e.g., `@service/provider`)
* **Pattern matching**: Use consistent pattern strings for `send()` and `@MessagePattern()`
* **Type safety**: Use generic types with `send<T>()` for response typing
* **Transport**: Services must use the same transport (e.g., REDIS) to communicate
* **Auto-discovery**: `microservices()` automatically discovers all services from `packages/apps/` (excluding gateway)
* **Gateway exclusion**: Gateway service is excluded from auto-discovery to prevent circular dependencies

## Communication Patterns

### Request-Response (`send` + `@MessagePattern`)

Use when you need a response:

```typescript
// Client
const result = await this.client.send('pattern', data)

// Service
@MessagePattern('pattern')
handleMessage(@Payload() data: any) {
  return { result: 'processed' }
}
```

### Event-Based (`emit` + `@EventPattern`)

Use for fire-and-forget events:

```typescript
// Client
this.client.emit('event', data)

// Service
@EventPattern('event')
handleEvent(@Payload() data: any) {
  // No return value expected
}
```
