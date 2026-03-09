import { env, PrismaConfig } from 'prisma/config'

export function defineConfig(config: PrismaConfig | PrismaConfig[]) {
  return Array.isArray(config) ? config : [config]
}

export { env }
