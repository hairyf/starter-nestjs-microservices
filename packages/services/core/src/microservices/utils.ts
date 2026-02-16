import type { Package } from '@manypkg/get-packages'
import type { ClientProviderOptions } from '@nestjs/microservices'
import path from 'node:path'
import { getPackagesSync } from '@manypkg/get-packages'
import { Transport } from '@nestjs/microservices'
import { parseWithEnvExpand } from '../utils'

const __dirname = path.dirname(import.meta.filename)

export type Microservice = ClientProviderOptions & {
  name: string
  relative: string
  absolute: string
}

function parsePackages(packages: Package[]) {
  const services: Microservice[] = []
  for (const pack of packages) {
    const absolute = pack.dir.replace(/\\/g, '/')
    const relative = pack.relativeDir.replace(/\\/g, '/')
    const json = pack.packageJson as any
    if (!relative.startsWith('packages/apps') || relative.startsWith('packages/apps/gateway'))
      continue

    if (!json.service.microservice)
      continue

    services.push({
      name: json.name,
      relative,
      absolute,
      transport: Transport[json.service.microservice.transport as keyof typeof Transport],
      options: parseWithEnvExpand(json.service.microservice.options),
    })
  }
  return services
}

export function getMicroservices() {
  const { packages } = getPackagesSync(path.join(__dirname, '..'))
  return parsePackages(packages)
}

export function getMicroservice(name: string) {
  return getMicroservices().find(service => service.name === name)
}
