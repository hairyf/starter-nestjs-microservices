import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { prismas } from '../utils'

async function main() {
  console.log('Syncing database by index.ts')
  const modules = prismas().map(module => module.charAt(0).toUpperCase() + module.slice(1))
  const indexTs = `${modules.map(module => `import { Prisma as ${module}Prisma, PrismaClient as ${module}PrismaClient } from './prisma/${module.toLowerCase()}/generated/client'`).join('\n')}

export {\n${modules.map(module => `  ${module}Prisma,\n  ${module}PrismaClient`).join(',\n')}\n}
`
  await fs.writeFile(path.join(process.cwd(), 'index.ts'), indexTs)
}

main()
