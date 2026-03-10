import { defineConfig } from '@hairy/lnv'
import { prismas } from './utils'

const config = defineConfig({
  scripts: {
    'prisma:validate': combinePrismaCommand('validate'),
    'prisma:generate': combinePrismaCommand('generate'),
    'prisma:migrate:dev': combinePrismaCommand('migrate dev'),
    'prisma:format': combinePrismaCommand('format'),
    'prisma:studio': combinePrismaCommand('studio'),
    'prisma:db:push': combinePrismaCommand('db push'),
    'prisma:db:pull': combinePrismaCommand('db pull'),
  },
})

function combinePrismaCommand(command: string) {
  return prismas().map(prisma => [
    `prisma ${command}`,
    `--schema=./prisma/${prisma}/schema.prisma`,
    `--config ./prisma/${prisma}/prisma.config.ts`,
  ].join(' ')).join(' && ')
}

export default config
