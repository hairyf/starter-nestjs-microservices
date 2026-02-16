import { ClientProxyFactory } from '@nestjs/microservices'
import { getMicroservice, getMicroservices } from './utils'

export function microservices() {
  return getMicroservices()
}

export function microservice(name: string) {
  return getMicroservice(name)!
}

export function client(name: string) {
  return ClientProxyFactory.create(microservice(name))
}

export function clients(includes: string[]) {
  return microservices()
    .filter(service => includes.includes(service.name as string))
    .map(service => ClientProxyFactory.create(service))
}
