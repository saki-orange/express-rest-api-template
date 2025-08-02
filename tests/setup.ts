import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

// テスト環境の環境変数を読み込み
dotenv.config({ path: ".env.test" });

// テスト用のPrismaクライアント（シングルトン）
let prismaInstance: PrismaClient | null = null;

export const getTestPrisma = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      datasources: {
        db: {
          url: process.env.TEST_DATABASE_URL,
        },
      },
      log: process.env.NODE_ENV === "test" ? [] : ["query", "info", "warn", "error"],
    });
  }
  return prismaInstance;
};

export const testPrisma = getTestPrisma();

// テスト前のデータベースクリーンアップ
export const cleanupDatabase = async () => {
  const prisma = getTestPrisma();
  try {
    await prisma.user.deleteMany();
    await prisma.session.deleteMany();
  } catch (error) {
    console.error("Error cleaning up database:", error);
    throw error;
  }
};

// テスト後のクリーンアップ
export const teardown = async () => {
  try {
    await cleanupDatabase();
  } catch (error) {
    console.error("Error during database cleanup:", error);
  } finally {
    if (prismaInstance) {
      await prismaInstance.$disconnect();
      prismaInstance = null;
    }
  }
};

// グローバルなテスト終了時のクリーンアップ
export const globalTeardown = async () => {
  // セッションストアのクリーンアップ
  const { cleanupSessionStore } = await import("./session");
  await cleanupSessionStore();

  // Prismaクライアントのクリーンアップ
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    prismaInstance = null;
  }
};
