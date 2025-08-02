import express from "express";
import dotenv from "dotenv";
import passport from "../src/config/passport";
import { testExpressSession } from "./session";
import apiRoute from "../src/route";

// テスト環境の環境変数を読み込み
dotenv.config({ path: ".env.test" });

// テスト用のアプリケーションファクトリ
export const createTestApp = () => {
  const app = express();

  app.use(express.json());
  app.use(testExpressSession);
  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api", apiRoute);

  return app;
};
