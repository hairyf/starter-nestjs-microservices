import { defineConfig } from '@hairy/lnv'

const config = defineConfig({
  scripts: {
    prisma: {
      message: 'Running Prisma command',
      command: [
        {
          value: [
            'prisma validate --schema=./prisma/user/schema.prisma --config ./prisma/user/prisma.config.ts',
            'prisma validate --schema=./prisma/post/schema.prisma --config ./prisma/post/prisma.config.ts',
          ].join(' && '),
          label: 'Validate schema (prisma validate)',
        },
        {
          value: [
            'prisma generate --schema=./prisma/user/schema.prisma --config ./prisma/user/prisma.config.ts',
            'prisma generate --schema=./prisma/post/schema.prisma --config ./prisma/post/prisma.config.ts',
          ].join(' && '),
          label: 'Generate Prisma client (prisma generate)',
        },
        {
          value: [
            'prisma migrate dev --schema=./prisma/user/schema.prisma --config ./prisma/user/prisma.config.ts',
            'prisma migrate dev --schema=./prisma/post/schema.prisma --config ./prisma/post/prisma.config.ts',
          ].join(' && '),
          label: 'Run migrations (prisma migrate dev)',
        },
        {
          value: [
            'prisma format --schema=./prisma/user/schema.prisma --config ./prisma/user/prisma.config.ts',
            'prisma format --schema=./prisma/post/schema.prisma --config ./prisma/post/prisma.config.ts',
          ].join(' && '),
          label: 'Format schema (prisma format)',
        },
        {
          value: [
            'prisma studio --schema=./prisma/user/schema.prisma --config ./prisma/user/prisma.config.ts',
            'prisma studio --schema=./prisma/post/schema.prisma --config ./prisma/post/prisma.config.ts',
          ].join(' && '),
          label: 'Open Prisma Studio (prisma studio)',
        },
        {
          value: [
            'prisma db push --schema=./prisma/user/schema.prisma --config ./prisma/user/prisma.config.ts',
            'prisma db push --schema=./prisma/post/schema.prisma --config ./prisma/post/prisma.config.ts',
          ].join(' && '),
          label: 'Push schema to database (prisma db push)',
        },
        {
          value: [
            'prisma db pull --schema=./prisma/user/schema.prisma --config ./prisma/user/prisma.config.ts',
            'prisma db pull --schema=./prisma/post/schema.prisma --config ./prisma/post/prisma.config.ts',
          ].join(' && '),
          label: 'Pull schema from database (prisma db pull)',
        },
      ],
    },
  },
})

export default config
