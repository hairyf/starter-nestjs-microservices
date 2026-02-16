---
name: project-structure
description: Monorepo organization and workspace patterns
---

# Project Structure

## Workspace Layout

```
packages/
├── apps/                  # Applications (runnable services)
│   ├── gateway/           # API Gateway (HTTP server)
│   ├── provider/          # Provider microservice
│   └── schedule/          # Scheduling microservice
└── services/              # Shared libraries
    ├── core/              # Core utilities and bootstrap
    └── redis/             # Redis integration
```

## Package Organization

### Applications (`packages/apps/`)

Each application is a standalone NestJS service:

```
gateway/
├── package.json          # Service configuration
├── tsconfig.json
└── src/
    ├── main.ts          # Bootstrap entry point
    ├── app.module.ts    # Root module
    └── modules/         # Feature modules
```

**package.json structure:**
```json
{
  "name": "@service/gateway",
  "dependencies": {
    "@service/core": "workspace:^",
    "@service/redis": "workspace:^"
  },
  "service": {
    "port": 3000
  }
}
```

### Shared Services (`packages/services/`)

Reusable libraries shared across applications:

```
core/
├── package.json
└── src/
    ├── bootstrap/       # Application bootstrap utilities
    ├── microservices/   # Microservice communication
    ├── constants/       # Shared constants
    └── utils/          # Utility functions
```

## Workspace Configuration

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/**'
```

### Root package.json

```json
{
  "scripts": {
    "dev": "pnpm -r --filter=\"./packages/**/*\" --parallel run dev",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit"
  }
}
```

## Service Configuration Pattern

### Gateway Service

Gateway typically:
- Exposes HTTP endpoints
- Communicates with other microservices
- Does NOT define `service.microservice` (excluded from discovery)

```json
{
  "name": "@service/gateway",
  "service": {
    "port": 3000
  }
}
```

### Microservice

Microservices define transport configuration:

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
    "port": 4000
  }
}
```

## Dependency Management

### Workspace Protocol

Use `workspace:^` for internal dependencies:

```json
{
  "dependencies": {
    "@service/core": "workspace:^",
    "@service/redis": "workspace:^"
  }
}
```

### External Dependencies

Install at root level for shared dependencies:

```bash
pnpm add @nestjs/common
```

Or per-package for specific needs:

```bash
pnpm --filter @service/gateway add @nestjs/bull
```

## Development Scripts

### Per-Package Scripts

Each package defines its own scripts:

```json
{
  "scripts": {
    "dev": "lnv -- oxrun watch src/main.ts",
    "start": "lnv -- oxrun src/main.ts"
  }
}
```

### Root-Level Scripts

Run all packages in parallel:

```bash
pnpm dev  # Starts all services
```

## Key Points

* **Separation of concerns**: Apps are runnable, services are libraries
* **Workspace protocol**: Use `workspace:^` for internal dependencies
* **Service discovery**: Only apps with `service.microservice` are discovered
* **Gateway exclusion**: Gateway is automatically excluded from microservice discovery
* **Shared code**: Common utilities live in `packages/services/`
* **Independent deployment**: Each app can be deployed independently
* **TypeScript**: Shared `tsconfig.json` at root, per-package overrides allowed

## Naming Conventions

- **Package names**: Use `@service/{name}` format
- **Directory names**: Match package name (kebab-case)
- **Service names**: Must match `package.json` name for discovery
- **Module names**: PascalCase (e.g., `QueueModule`)

## Adding a New Service

1. Create directory: `packages/apps/new-service/`
2. Add `package.json` with service configuration
3. Create `src/main.ts` and `src/app.module.ts`
4. Service is automatically discovered if `service.microservice` is defined
