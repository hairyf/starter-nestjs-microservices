import process from 'node:process'

export function withUnhandledRejection() {
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
}
