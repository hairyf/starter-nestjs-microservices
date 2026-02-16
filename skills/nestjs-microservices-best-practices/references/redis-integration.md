---
name: redis-integration
description: Redis client setup and usage patterns
---

# Redis Integration

## Usage

### Basic Setup

The `@service/redis` package provides a Redis client with automatic environment detection:

```typescript
import { redis } from '@service/redis'

// Check if Redis is available
if (redis.enable) {
  // Use Redis client
  await redis.set('key', 'value')
  const value = await redis.get('key')
}
```

### Environment Configuration

Redis is automatically enabled if either configuration is present:

**Option 1: Host and Port**
```env
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Option 2: Connection URL**
```env
REDIS_URL=redis://localhost:6379
```

### Integration with Bull Queue

```typescript
import { BullModule } from '@nestjs/bull'
import { redis } from '@service/redis'

@Module({
  imports: [
    BullModule.forRoot({
      redis: redis.enable
        ? {
            host: redis.options.host,
            port: redis.options.port,
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
          }
        : undefined,
    }),
  ],
})
export class QueueModule {}
```

### Direct Redis Operations

```typescript
import { redis } from '@service/redis'

@Injectable()
export class CacheService {
  async setCache(key: string, value: string, ttl?: number) {
    if (!redis.enable) {
      throw new Error('Redis is not available')
    }

    if (ttl) {
      await redis.setex(key, ttl, value)
    } else {
      await redis.set(key, value)
    }
  }

  async getCache(key: string) {
    if (!redis.enable) {
      return null
    }

    return redis.get(key)
  }

  async deleteCache(key: string) {
    if (!redis.enable) {
      return
    }

    await redis.del(key)
  }
}
```

## Proxy Pattern

The Redis client uses a proxy pattern that provides:

- **Safe access**: Returns `undefined` if Redis is not configured
- **Type safety**: Full TypeScript support for ioredis methods
- **Enable flag**: `redis.enable` indicates if Redis is available
- **Options access**: `redis.options` provides host/port when enabled

## Key Points

* **Optional dependency**: Redis is optional - application works without it
* **Auto-detection**: Automatically detects Redis configuration from environment
* **ioredis client**: Uses `ioredis` library under the hood
* **Proxy safety**: Throws error if accessed when not enabled (with strict mode)
* **Connection options**: Supports standard ioredis `RedisOptions`
* **URL support**: Accepts both host/port and connection URL formats

## Error Handling

```typescript
import { redis } from '@service/redis'

async function useRedis() {
  if (!redis.enable) {
    // Handle gracefully when Redis is not available
    console.warn('Redis not configured, using fallback')
    return fallbackMethod()
  }

  try {
    return await redis.get('key')
  } catch (error) {
    // Handle Redis connection errors
    console.error('Redis error:', error)
    return fallbackMethod()
  }
}
```

## Integration Patterns

### With Microservices

Redis is commonly used as the transport layer:

```json
{
  "service": {
    "microservice": {
      "transport": "REDIS",
      "options": {
        "host": "$REDIS_HOST",
        "port": "$REDIS_PORT"
      }
    }
  }
}
```

### With Queue Processing

Bull queues require Redis for job storage and processing.

### With Caching

Use Redis for application-level caching:

```typescript
@Injectable()
export class UserService {
  constructor(private cache: CacheService) {}

  async getUser(id: string) {
    const cached = await this.cache.getCache(`user:${id}`)
    if (cached) {
      return JSON.parse(cached)
    }

    const user = await this.fetchUser(id)
    await this.cache.setCache(`user:${id}`, JSON.stringify(user), 3600)
    return user
  }
}
```
