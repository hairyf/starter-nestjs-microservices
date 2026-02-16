---
name: swagger-integration
description: Swagger API documentation setup and configuration
---

# Swagger Integration

## Usage

### Basic Setup

```typescript
import { NestFactory } from '@nestjs/core'
import { withNestjsSwagger } from '@service/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  withNestjsSwagger(app, config => config
    .setTitle('Website')
    .setDescription('The website API')
    .setVersion('1.0'))

  await app.listen(3000)
}

bootstrap()
```

### Advanced Configuration

```typescript
withNestjsSwagger(app, config => config
  .setTitle('API Documentation')
  .setDescription('Comprehensive API documentation')
  .setVersion('1.0')
  .addTag('users', 'User management endpoints')
  .addTag('orders', 'Order processing endpoints')
  .addBearerAuth()
  .addServer('https://api.example.com', 'Production')
  .addServer('https://staging.example.com', 'Staging'))
```

## Controller Decorators

### Basic Endpoint Documentation

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'

@Controller('users')
@ApiTags('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll() {
    return []
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'John Doe' },
        email: { type: 'string', example: 'john@example.com' },
      },
      required: ['name', 'email'],
    },
  })
  create(@Body() data: any) {
    return { id: 1, ...data }
  }
}
```

### Query Parameters

```typescript
import { ApiQuery } from '@nestjs/swagger'

@Get('search')
@ApiOperation({ summary: 'Search users' })
@ApiQuery({ name: 'q', description: 'Search query', required: false })
@ApiQuery({ name: 'page', description: 'Page number', type: Number, required: false })
search(@Query('q') query: string, @Query('page') page: number) {
  return []
}
```

### DTOs with Swagger

```typescript
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User full name' })
  name: string

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  email: string

  @ApiProperty({ example: 25, required: false, description: 'User age' })
  age?: number
}

@Post()
@ApiOperation({ summary: 'Create user' })
create(@Body() dto: CreateUserDto) {
  return dto
}
```

## Access Points

After setup, Swagger is available at:

- **UI**: `http://localhost:3000/swagger/website`
- **JSON**: `http://localhost:3000/swagger/json`

## Key Points

* **Path customization**: Default path is `/swagger/website` (can be changed in `withNestjsSwagger`)
* **JSON export**: JSON schema is available at `/swagger/json` for code generation
* **Tag organization**: Use `@ApiTags()` to group related endpoints
* **DTO validation**: Combine with `class-validator` for request validation
* **Bearer auth**: Use `config.addBearerAuth()` for JWT token documentation
* **Multiple servers**: Document different environments with `addServer()`

## Integration with Validation

```typescript
import { IsString, IsEmail, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(3)
  name: string

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string
}
```

This provides both runtime validation and API documentation.
