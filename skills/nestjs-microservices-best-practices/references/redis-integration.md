---
name: redis-integration
description: Redis client setup and usage patterns
---

# Redis Integration

## Usage

### Basic Setup

The `@service/redis` package exports a **ghost** (from `@hairy/utils`) that is resolved to an ioredis `Redis` instance when env is set. Use `redis.enabled` to check availability:

```typescript
import { redis } from '@service/redis'

// Check if Redis is available (ghost has been resolved)
if (redis.enabled) {
  // Use ioredis methods directly
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

When `redis.enabled` is true, `redis` is the real ioredis client; use `redis.options` (host/port) for Bull:

```typescript
import { BullModule } from '@nestjs/bull'
import { redis } from '@service/redis'

@Module({
  imports: [
    BullModule.forRoot({
      redis: redis.enabled
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

Always guard with `redis.enabled`; when not enabled, calling ioredis methods on the ghost will throw.

```typescript
import { redis } from '@service/redis'

@Injectable()
export class CacheService {
  async setCache(key: string, value: string, ttl?: number) {
    if (!redis.enabled) {
      throw new Error('Redis is not available')
    }

    if (ttl) {
      await redis.setex(key, ttl, value)
    } else {
      await redis.set(key, value)
    }
  }

  async getCache(key: string) {
    if (!redis.enabled) {
      return null
    }

    return redis.get(key)
  }

  async deleteCache(key: string) {
    if (!redis.enabled) {
      return
    }

    await redis.del(key)
  }
}
```

## Ghost API (from `@hairy/utils`)

The exported `redis` is a **ghost** of type `Ghost<Redis>`:

- **`redis.enabled`**: `true` after `redis.resolve(redisInstance)` is called (when env has `REDIS_*`).
- **`redis.resolve(value)`**: Called by the package on load when env is set; do not call in app code.
- **ioredis methods**: When `enabled`, `redis` is the real ioredis client (`get`, `set`, `setex`, `del`, etc.).
- **`redis.options`**: When enabled, the underlying client’s connection options (e.g. `host`, `port`) for Bull or other config.
- **Strict behavior**: If Redis is not configured, calling methods on `redis` (e.g. `redis.get()`) throws the ghost’s strict message. Always check `redis.enabled` first.

## Key Points

* **Optional dependency**: Redis is optional; the ghost is unresolved until env is set.
* **Auto-detection**: On load, if `REDIS_HOST`+`REDIS_PORT` or `REDIS_URL` is set, the package calls `redis.resolve(new Redis(...))`.
* **ioredis client**: Resolved value is a real `ioredis` `Redis` instance; full ioredis API when `redis.enabled`.
* **Ghost safety**: Call methods only when `redis.enabled`; otherwise the ghost throws.
* **Connection options**: Supports `RedisOptions` (host/port) or `REDIS_URL`; when enabled, `redis.options` exposes connection options.
* **URL support**: Accepts both host/port and connection URL formats.

## Error Handling

```typescript
import { redis } from '@service/redis'

async function useRedis() {
  if (!redis.enabled) {
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
