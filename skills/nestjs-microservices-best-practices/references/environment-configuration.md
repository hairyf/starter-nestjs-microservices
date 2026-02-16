---
name: environment-configuration
description: Environment variables and service configuration patterns
---

# Environment Configuration

## Usage

### Service Configuration in package.json

Each service defines its configuration in `package.json`:

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

### Environment Variable Expansion

Use `$VARIABLE_NAME` syntax for environment variable substitution:

```json
{
  "service": {
    "microservice": {
      "options": {
        "host": "$REDIS_HOST",        // Expands to process.env.REDIS_HOST
        "port": "$REDIS_PORT",         // Expands to process.env.REDIS_PORT
        "password": "$REDIS_PASSWORD"  // Expands to process.env.REDIS_PASSWORD
      }
    }
  }
}
```

### Environment Variables

Common environment variables:

```env
# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379  # Alternative to host/port

# Database
DATABASE_URL=mysql://user:password@localhost:3306/dbname

# Server
NODE_ENV=development
SERVER_PORT=3000
```

### Runtime Configuration Access

Access service configuration at runtime:

```typescript
import { app } from '@service/core'

// Access current app instance
const appInstance = app.instance

// Access port
const port = app.port

// Access URL
const url = app.url  // http://localhost:3000 (in development)

// Access microservice config
const microservice = app.microservice
```

## Configuration Patterns

### Development vs Production

```typescript
import { app } from '@service/core'

const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

if (isDevelopment) {
  // Development-specific configuration
  console.log(`Server running at ${app.url}`)
} else {
  // Production-specific configuration
  app.url = process.env.APP_URL
}
```

### Service-Specific Configuration

Each service can have different configurations:

**Gateway (package.json):**
```json
{
  "service": {
    "port": 3000
  }
}
```

**Provider (package.json):**
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

### Dynamic Port Assignment

The `withNestjsListen` function handles port conflicts automatically:

```typescript
// If port 3000 is in use, automatically tries 3001, 3002, etc.
await withNestjsListen(app, service.port)
```

## Key Points

* **Environment expansion**: `$VARIABLE_NAME` syntax is automatically expanded
* **Service-specific**: Each service has its own configuration in package.json
* **Runtime access**: Use `app` object from `@service/core` for runtime config
* **Port fallback**: Listen function automatically handles port conflicts
* **URL generation**: App URL is auto-generated in development mode
* **Microservice config**: Microservice options are parsed and expanded at runtime
* **Type safety**: Configuration is typed through TypeScript interfaces

## Configuration Validation

Validate required environment variables:

```typescript
function validateEnv() {
  const required = ['REDIS_HOST', 'REDIS_PORT']
  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Call before bootstrap
validateEnv()
```

## Docker Configuration

Use environment variables in docker-compose.yml:

```yaml
services:
  gateway:
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - NODE_ENV=production
    ports:
      - "3000:3000"
```

## Key Points

* **Validation**: Validate required environment variables at startup
* **Defaults**: Provide sensible defaults where possible
* **Secrets**: Never commit secrets - use environment variables
* **Docker**: Use docker-compose for local development environment
* **Documentation**: Document all required environment variables in README
