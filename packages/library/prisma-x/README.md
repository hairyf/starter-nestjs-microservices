1. 接管 `prisma` 的 cli 行为。

- `prisma-x --help` 显示帮助信息。
- `prisma-x init` 初始化 Prisma。
- `prisma-x generate` 生成 Prisma Client。
  - 如果是多个 schema（prisma/post、prisma/user）`prisma-x` 自动生成多个 config.ts 文件，并根据 schema 生成对应的 Prisma Client。
    - `prisma-x generate --schema=prisma/post/schema.prisma --config=node_modules/.prisma/post/config.ts`
    - `prisma-x generate --schema=prisma/user/schema.prisma --config=node_modules/.prisma/user/config.ts`
- `prisma-x migrate` 迁移数据库（同上）。
- `prisma-x studio` 浏览数据库（同上，port 自增，从默认的 5555 开始）。
- `prisma-x db` 管理数据库（同上）。
- `prisma-x validate` 验证 Prisma 配置（同上）。
- `prisma-x format` 格式化 Prisma 配置（同上）。
- `prisma-x version` 显示 Prisma 版本信息（同上）。
- `prisma-x debug` 显示 Prisma 调试信息（同上）。

同时，支持多数据库的每个指令还支持：
 - `--interactive` 交互模式（优先级低）
 - `--filter <alias>` 指定某个数据库的指令

由于多数据库在官方的 CLI 上并没有得到正式支持，所以该实现需要静默掉官方的输出，并提供自己的输出（尽可能参考官方，但在多数据库的情况下，需要提供更好的输出）

具体实现为使用 `tinyexec` 执行官方的 CLI，使用 unjs 的 `citty` 接管和魔改每一个官方指令。
