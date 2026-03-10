import fs from 'node:fs'
import path from 'node:path'

export function prismas() {
  return fs.readdirSync(path.join(__dirname, '..', 'prisma'))
}
