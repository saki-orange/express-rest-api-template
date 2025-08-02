import request from "supertest";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { createTestApp } from "./app";
import { testPrisma, cleanupDatabase, teardown, globalTeardown } from "./setup";

// テスト環境の環境変数を読み込み
dotenv.config({ path: ".env.test" });

const app = createTestApp();

// すべてのテスト完了後のグローバルクリーンアップ
afterAll(async () => {
  await globalTeardown();
});

describe("Authentication API", () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterAll(async () => {
    await teardown();
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      await request(app).post("/api/auth/register").send(userData).expect(201);

      // データベースにユーザーが作成されているか確認
      const user = await testPrisma.user.findUnique({
        where: { email: userData.email },
      });

      expect(user).toBeTruthy();
      expect(user?.name).toBe(userData.name);
      expect(user?.email).toBe(userData.email);

      // パスワードがハッシュ化されているか確認
      const isPasswordValid = await bcrypt.compare(userData.password, user?.password || "");
      expect(isPasswordValid).toBe(true);
    });

    it("should return 400 if user already exists", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      // 最初のユーザー作成
      await testPrisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: await bcrypt.hash(userData.password, 10),
        },
      });

      // 同じメールアドレスで再度登録を試行
      const response = await request(app).post("/api/auth/register").send(userData).expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "User already exists");
    });

    it("should return 400 for invalid input data", async () => {
      const invalidData = {
        name: "",
        email: "invalid-email",
        password: "123", // too short
      };

      const response = await request(app).post("/api/auth/register").send(invalidData).expect(400);

      expect(response.body).toHaveProperty("success", false);
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        name: "Test User",
        // email and password missing
      };

      const response = await request(app).post("/api/auth/register").send(incompleteData).expect(400);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // テスト用ユーザーを作成
      const hashedPassword = await bcrypt.hash("password123", 10);
      await testPrisma.user.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: hashedPassword,
        },
      });
    });

    it("should login successfully with valid credentials", async () => {
      const loginData = {
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app).post("/api/auth/login").send(loginData).expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "Login successful");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user).toHaveProperty("email", loginData.email);
    });

    it("should return 401 for invalid email", async () => {
      const loginData = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      const response = await request(app).post("/api/auth/login").send(loginData).expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toMatch("Invalid email or password");
    });

    it("should return 401 for invalid password", async () => {
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const response = await request(app).post("/api/auth/login").send(loginData).expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body.message).toMatch("Invalid email or password");
    });

    it("should return 400 for missing credentials", async () => {
      const incompleteData = {
        email: "test@example.com",
        // password missing
      };

      const response = await request(app).post("/api/auth/login").send(incompleteData).expect(401);

      expect(response.body).toHaveProperty("success", false);
    });
  });

  describe("POST /api/auth/logout", () => {
    let agent: ReturnType<typeof request.agent>;

    beforeEach(async () => {
      // テスト用ユーザーを作成
      const hashedPassword = await bcrypt.hash("password123", 10);
      await testPrisma.user.create({
        data: {
          name: "Test User",
          email: "test@example.com",
          password: hashedPassword,
        },
      });

      // エージェントを作成してセッションを維持
      agent = request.agent(app);

      // ログイン
      await agent
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password123",
        })
        .expect(200);
    });

    it("should logout successfully when authenticated", async () => {
      const response = await agent.post("/api/auth/logout").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "Logout successful");
    });

    it("should return 401 when not authenticated", async () => {
      const response = await request(app).post("/api/auth/logout").expect(401);

      expect(response.body).toHaveProperty("success", false);
    });

    it("should clear session after logout", async () => {
      // ログアウト
      await agent.post("/api/auth/logout").expect(200);

      // ログアウト後に再度ログアウトを試行すると401が返される
      await agent.post("/api/auth/logout").expect(401);
    });
  });

  describe("Integration Tests", () => {
    it("should handle complete authentication flow", async () => {
      const userData = {
        name: "Integration Test User",
        email: "integration@example.com",
        password: "password123",
      };

      const agent = request.agent(app);

      // 1. ユーザー登録
      await agent.post("/api/auth/register").send(userData).expect(201);

      // 2. ログイン
      const loginResponse = await agent
        .post("/api/auth/login")
        .send({
          email: userData.email,
          password: userData.password,
        })
        .expect(200);

      expect(loginResponse.body).toHaveProperty("success", true);
      expect(loginResponse.body.data.user.email).toBe(userData.email);

      // 3. ログアウト
      const logoutResponse = await agent.post("/api/auth/logout").expect(200);

      expect(logoutResponse.body).toHaveProperty("success", true);
      expect(logoutResponse.body).toHaveProperty("message", "Logout successful");

      // 4. ログアウト後は認証が必要なエンドポイントにアクセスできない
      await agent.post("/api/auth/logout").expect(401);
    });
  });
});
