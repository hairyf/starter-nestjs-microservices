---
name: service-discovery
description: Automatic service discovery from package.json configuration
---

# Service Discovery

## Usage

The framework automatically discovers microservices by scanning `packages/apps/` directories and reading their `package.json` files.

### Service Configuration

Each microservice defines its configuration in `package.json`:

```json
{
  "name": "@service/provider",
  "service": {
    "microservice": {
      "transport": "REDIS",
      "options": {
        "host": "$REDIS_HOST",
        "port": "$REDIS_PORT"
      }
    },
    "host": "127.0.0.1",
    "port": 4000
  }
}
```

### Discovery Functions

```typescript
import { microservices, microservice, getMicroservices } from '@service/core'

// Get all discovered microservices
const allServices = microservices()
// Returns: Array of Microservice configs

// Get specific service by name
const providerService = microservice('@service/provider')
// Returns: Microservice config or undefined

// Direct access to discovery utility
const services = getMicroservices()
```

## Discovery Rules

### Included Services

- Services in `packages/apps/` directory
- Must have `service.microservice` defined in `package.json`
- Must not be the gateway service

### Excluded Services

- Gateway service (`packages/apps/gateway`) is automatically excluded
- Services without `service.microservice` configuration

### Service Structure

Discovered services include:

```typescript
type Microservice = {
  name: string                    // package.json name
  relative: string                // Relative path from workspace root
  absolute: string                // Absolute path
  transport: Transport            // NestJS Transport enum
  options: Record<string, any>    // Transport options with env expansion
}
```

## Environment Variable Expansion

Options support environment variable substitution:

```json
{
  "service": {
    "microservice": {
      "options": {
        "host": "$REDIS_HOST",      // Expands to process.env.REDIS_HOST
        "port": "$REDIS_PORT"       // Expands to process.env.REDIS_PORT
      }
    }
  }
}
```

## Key Points

* **Automatic scanning**: Uses `@manypkg/get-packages` to discover workspace packages
* **Path normalization**: Automatically converts Windows paths (`\`) to Unix format (`/`)
* **Transport conversion**: Converts string transport names to NestJS `Transport` enum values
* **Workspace-aware**: Only scans packages within the monorepo workspace
* **Runtime discovery**: Discovery happens at runtime, not build time

## Integration with Clients

The discovered services are used by `ClientsModule.register()`:

```typescript
import { ClientsModule } from '@nestjs/microservices'
import { microservices } from '@service/core'

@Module({
  imports: [
    ClientsModule.register(microservices()), // Auto-registers all discovered services
  ],
})
export class AppModule {}
```

This allows injecting any discovered service by its package name:

```typescript
@Inject('@service/provider') private client: ClientProxy
```
