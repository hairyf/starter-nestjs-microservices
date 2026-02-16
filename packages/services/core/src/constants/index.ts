import type { INestApplication } from '@nestjs/common'
import type { Microservice } from '../types'
import process from 'node:process'

let _url: string | undefined

export const app = {
  instance: undefined as INestApplication | undefined,
  port: undefined as string | number | undefined,
  env: process?.env?.NODE_ENV as 'development' | 'production',
  get url() {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
      if (this.port)
        return `http://localhost:${this.port}`
    }
    return _url
  },
  set url(value) {
    _url = value
  },
  microservice: undefined as Microservice | undefined,
}
