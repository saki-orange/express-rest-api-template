import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { testPrisma } from "./setup";

// テスト用のセッションストア（タイマーなし）
const testSessionStore = new PrismaSessionStore(testPrisma, {
  checkPeriod: 0, // テスト環境ではクリーンアップタイマーを無効化
  dbRecordIdIsSessionId: undefined,
  dbRecordIdFunction: undefined,
});

export const testExpressSession = session({
  secret: "test-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false, // テスト環境ではHTTPS不要
    sameSite: "strict",
  },
  store: testSessionStore,
});

// テスト終了時のセッションストアクリーンアップ
export const cleanupSessionStore = async () => {
  if (testSessionStore && typeof testSessionStore.stopInterval === "function") {
    testSessionStore.stopInterval();
  }
};
