/* eslint-disable no-extend-native */
import type { INestApplication } from '@nestjs/common'

export function withNestjsBigintRepair(_app: INestApplication, decimal?: any) {
  if (!decimal)
    return

  Object.defineProperty(decimal.prototype, 'toString', {
    get() { return () => new BigNumber(this.toHex()).toFixed() },
  })
  Object.defineProperty(decimal.prototype, 'toJSON', {
    get() { return () => new BigNumber(this.toHex()).toFixed() },
  })

  Object.defineProperty(BigInt.prototype, 'toJSON', {
    get() { return () => String(this) },
  })
}
