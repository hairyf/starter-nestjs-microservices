import process from 'node:process'
import { expand } from 'dotenv-expand'

// TODO: deep parse
export function parseWithEnvExpand<T extends Record<string, string>>(obj: T): T {
  const { parsed } = expand({
    processEnv: process.env as Record<string, string>,
    parsed: obj,
  })
  return parsed as T
}
