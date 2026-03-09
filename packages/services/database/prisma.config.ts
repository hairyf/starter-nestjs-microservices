import { defineConfig, env } from 'prisma-x'

export default defineConfig([
  {
    schema: 'prisma/user/schema.prisma',
    migrations: {
      path: 'prisma/user/migrations',
    },
    datasource: {
      url: env('PPG_USER_DATABASE_URL'),
    },
  },
  {
    schema: 'prisma/post/schema.prisma',
    migrations: {
      path: 'prisma/post/migrations',
    },
    datasource: {
      url: env('PPG_POST_DATABASE_URL'),
    },
  },
])
