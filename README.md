# Express TypeScript API Template

モダンな Express.js アプリケーションのためのテンプレートプロジェクト。TypeScript、Prisma ORM、PostgreSQL、Passport.js による認証機能を含んでいます。

## ✨ 機能

- **TypeScript**: 型安全性とより良い開発体験
- **Express.js**: 高速で軽量なWebフレームワーク
- **Prisma ORM**: 型安全なデータベースアクセス
- **PostgreSQL**: 堅牢なリレーショナルデータベース
- **認証システム**: Passport.js によるローカル認証
- **セッション管理**: express-session + Prisma セッションストア
- **バリデーション**: Zod による入力値検証
- **テスト**: Jest + Supertest によるAPIテスト
- **リンティング**: ESLint + Prettier によるコード品質管理
- **Docker**: 開発環境の統一

## 🛠 技術スタック

### バックエンド
- **Runtime**: Node.js
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **ORM**: Prisma 6.x
- **Database**: PostgreSQL 16
- **Authentication**: Passport.js (Local Strategy)
- **Session**: express-session + Prisma Session Store
- **Validation**: Zod
- **Password Hashing**: bcryptjs

### 開発ツール
- **Package Manager**: pnpm
- **Testing**: Jest + Supertest
- **Linting**: ESLint
- **Formatting**: Prettier
- **Development**: nodemon
- **Containerization**: Docker & Docker Compose

## 📁 プロジェクト構成

```
express-template/
├── prisma/                  # Prisma設定とマイグレーション
│   ├── schema.prisma       # データベーススキーマ定義
│   └── migrations/         # データベースマイグレーション
├── src/                    # ソースコード
│   ├── config/            # 設定ファイル
│   │   ├── index.ts       # 環境変数設定
│   │   ├── express_session.ts  # セッション設定
│   │   └── passport.ts    # Passport.js設定
│   ├── controller/        # コントローラー層
│   │   └── auth.ts        # 認証関連コントローラー
│   ├── db/               # データベース接続
│   │   └── prisma.ts     # Prismaクライアント
│   ├── helper/           # ヘルパー関数
│   │   └── response.ts   # APIレスポンス整形
│   ├── middleware/       # ミドルウェア
│   │   ├── auth_check.ts # 認証チェック
│   │   └── request_validator.ts  # リクエスト検証
│   ├── route/           # ルート定義
│   │   ├── index.ts     # メインルーター
│   │   └── auth.ts      # 認証ルート
│   ├── schema/          # Zodスキーマ定義
│   │   └── auth.ts      # 認証スキーマ
│   ├── types/           # TypeScript型定義
│   │   ├── express.d.ts # Express型拡張
│   │   └── json.d.ts    # JSON型定義
│   └── index.ts         # アプリケーションエントリーポイント
├── tests/               # テストファイル
│   ├── auth.test.ts     # 認証APIテスト
│   ├── app.ts          # テスト用アプリ設定
│   ├── session.ts      # テスト用セッション設定
│   └── setup.ts        # テストセットアップ
├── docker-compose.yml   # Docker Compose設定
├── package.json        # プロジェクト設定
└── tsconfig.json       # TypeScript設定
```

## 🚀 セットアップ

### 前提条件

- Node.js 18+ 
- pnpm 8+
- PostgreSQL 16+ (または Docker)

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd express-rest-api-template
```

### 2. 依存関係のインストール

```bash
pnpm install
```

### 3. 環境変数の設定

`.env` ファイルを作成し、以下の変数を設定：

```env
# データベース接続
DATABASE_URL="postgresql://your_username:your_password@localhost:5432/your_database_name"

# セッション設定
SESSION_SECRET="your-session-secret-here"

# PostgreSQL設定（Docker使用時）
POSTGRES_USER=your_username
POSTGRES_PASSWORD=your_password
POSTGRES_DB=your_database_name
```

### 4. データベースの起動

#### Docker を使用する場合

```bash
docker compose up -d db
```

#### ローカルPostgreSQLを使用する場合

PostgreSQLサービスが起動していることを確認してください。

### 5. データベースのマイグレーション

```bash
# Prismaクライアントの生成
pnpm prisma generate

# マイグレーションの実行
pnpm prisma migrate deploy
```

### 6. TypeScriptのビルド

```bash
pnpm run build
```

## 🔧 開発

### 開発サーバーの起動

```bash
# 開発モード（ホットリロード付き）
pnpm run dev

# 本番モード
pnpm run start
```

サーバーは `http://localhost:8000` で起動します。

### 利用可能なスクリプト

```bash
# ビルド
pnpm run build

# 開発サーバー起動
pnpm run dev

# 本番サーバー起動
pnpm run start

# データベースマイグレーション
pnpm run migrate

# コードリンティング
pnpm run lint

# コード整形
pnpm run lint-fix

# テスト実行
pnpm run test

# テスト（ウォッチモード）
pnpm run test:watch

# テストカバレッジ
pnpm run test:coverage

# 認証テストのみ実行
pnpm run test:auth
```

## 📡 API エンドポイント

### 認証エンドポイント

#### ユーザー登録
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**レスポンス:**
- `201`: 登録成功
- `400`: ユーザーが既に存在またはバリデーションエラー
- `500`: サーバーエラー

#### ログイン
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**レスポンス:**
- `200`: ログイン成功
- `401`: 認証失敗
- `500`: サーバーエラー

#### ログアウト
```http
POST /api/auth/logout
```

**要件:** 認証が必要

**レスポンス:**
- `200`: ログアウト成功
- `401`: 未認証

### レスポンス形式

#### 成功レスポンス
```json
{
  "success": true,
  "data": null,
  "message": "Success message"
}
```

#### エラーレスポンス
```json
{
  "success": false,
  "error": {
    "details": [
      {
        "path": ["field_name"],
        "message": "Error message"
      }
    ]
  },
  "message": "Error message"
}
```

## 🗄 データベース

### スキーマ

#### User テーブル
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
  updatedAt DateTime @default(now()) @updatedAt
}
```

#### Session テーブル
```prisma
model Session {
  id        String   @id
  sid       String   @unique
  data      String
  expiresAt DateTime
  createdAt DateTime @default(now())
}
```

### Prisma コマンド

```bash
# Prismaクライアント生成
pnpm exec prisma generate

# マイグレーション作成
pnpm exec prisma migrate dev --name migration_name

# マイグレーション適用
pnpm exec prisma migrate deploy

# データベースリセット
pnpm exec prisma migrate reset

# Prisma Studio起動
pnpm exec prisma studio
```

## 🧪 テスト

### テストの実行

```bash
# 全テスト実行
pnpm run test

# ウォッチモード
pnpm run test:watch

# カバレッジ付き
pnpm run test:coverage

# 認証テストのみ
pnpm run test:auth
```

### テスト環境

テスト用の環境変数を `.env.test` に設定：

```env
NODE_ENV=test
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/test_db
```

### テストデータベースのセットアップ

```bash
# PostgreSQLにログイン
psql -U postgres

# テスト用データベースとユーザーを作成
CREATE DATABASE test_db;
CREATE USER test WITH PASSWORD 'test';
GRANT ALL PRIVILEGES ON DATABASE test_db TO test;
```

## 🚀 デプロイメント

### 本番環境の準備

1. **環境変数の設定**
   ```env
   NODE_ENV=production
   DATABASE_URL=postgresql://user:pass@host:port/db
   SESSION_SECRET=secure-random-string
   ```

2. **ビルド**
   ```bash
   pnpm run build
   ```

3. **マイグレーション**
   ```bash
   pnpm run migrate
   ```

4. **サーバー起動**
   ```bash
   pnpm run start
   ```

### Docker を使用したデプロイ

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 8000
CMD ["npm", "start"]
```

## ⚙️ 設定

### 環境変数

| 変数名              | 説明                               |
| ------------------- | ---------------------------------- |
| `DATABASE_URL`      | PostgreSQL接続URL                  |
| `SESSION_SECRET`    | セッション暗号化キー               |
| `POSTGRES_USER`     | PostgreSQLユーザー（Docker）       |
| `POSTGRES_PASSWORD` | PostgreSQLパスワード（Docker）     |
| `POSTGRES_DB`       | PostgreSQLデータベース名（Docker） |

### TypeScript設定

`tsconfig.json` でコンパイル設定を管理。主要な設定：

- **target**: ES2020
- **module**: CommonJS
- **outDir**: ./dist
- **strict**: true

### ESLint設定

`eslint.config.mjs` でコード品質ルールを定義。

### Jest設定

`jest.config.js` でテスト設定を管理。
