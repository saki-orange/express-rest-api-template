import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export default {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  // 非同期操作のタイムアウト設定
  testTimeout: 30000,
  // オープンハンドルの検出
  detectOpenHandles: true,
  // 強制終了を有効化
  forceExit: true,
};
