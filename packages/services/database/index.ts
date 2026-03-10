import { Prisma as PostPrisma, PrismaClient as PostPrismaClient } from './prisma/post/generated/client'
import { Prisma as UserPrisma, PrismaClient as UserPrismaClient } from './prisma/user/generated/client'

export {
  PostPrisma,
  PostPrismaClient,
  UserPrisma,
  UserPrismaClient,
}
