import { defineConfig } from 'tsdown'

const config = defineConfig({
  entry: {
    index: './index.ts',
    post: './prisma/post/generated/client.ts',
    user: './prisma/user/generated/client.ts',
  },
  exports: {
    enabled: true,
    devExports: true,
  },
})

export default config
