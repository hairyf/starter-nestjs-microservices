import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineConfig } from 'tsdown'

const entry = fs.readdirSync(path.join(process.cwd(), 'prisma'))
  .map((prisma) => {
    return { [prisma]: `./prisma/${prisma}/generated/client.ts` }
  })
  .reduce(
    (acc, curr) => {
      return { ...acc, ...curr }
    },
    { index: './index.ts' },
  )

const config = defineConfig({
  entry,
  exports: {
    enabled: true,
    devExports: true,
  },
})

export default config
