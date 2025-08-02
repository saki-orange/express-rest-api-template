import type { User as PrismaUser } from "@prisma/client";

// Express.Userの型定義
declare global {
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends PrismaUser {}
  }
}
