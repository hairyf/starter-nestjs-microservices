import process from 'node:process'
import { NestFactory } from '@nestjs/core'
import {
  withNestjsBigintRepair,
  withNestjsCors,
  withNestjsListen,
  withNestjsMicroservice,
  withNestjsSwagger,
} from '@service/core'
import { service } from '../package.json'
import { AppModule } from './app.module'

// 全局处理未捕获的 Promise rejection（用于定时任务等场景）
process.on('unhandledRejection', (reason: unknown) => {
  // 检查是否是 Redlock 获取锁失败的错误
  if (reason instanceof Error && reason.message.includes('Failed to acquire lock')) {
    // 静默处理锁获取失败，这是正常的分布式锁行为
    // 不需要记录错误日志，因为这是预期的行为
    return
  }
  // 其他错误记录日志，但不抛出（避免进程崩溃）
  // NestJS 的异常过滤器会处理 HTTP 请求中的错误
  if (reason instanceof Error) {
    console.error('Unhandled Promise Rejection:', reason.message, reason.stack)
  }
  else {
    console.error('Unhandled Promise Rejection:', reason)
  }
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  withNestjsBigintRepair(app)
  withNestjsSwagger(app, config => config
    .setTitle('Website')
    .setDescription('The website API')
    .setVersion('1.0'))

  withNestjsCors(app)

  await withNestjsMicroservice(app, service)
  await withNestjsListen(app, service.port)
}
bootstrap()
