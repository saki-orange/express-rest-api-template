# API Tests

このディレクトリには認証APIのテストが含まれています。

## セットアップ

### 前提条件

1. PostgreSQLがローカルで動作していること
2. テスト用データベースが作成されていること

### テスト用データベースの作成

```bash
# PostgreSQLにログイン
psql -U postgres

# テスト用データベースとユーザーを作成
CREATE DATABASE test_db;
CREATE USER test WITH PASSWORD 'test';
GRANT ALL PRIVILEGES ON DATABASE test_db TO test;
```

### 環境変数

テスト用の環境変数は `.env.test` ファイルに定義されています：

```
NODE_ENV=test
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/test_db
```

### Prismaマイグレーション

テストデータベースにスキーマを適用：

```bash
npx prisma migrate deploy --schema prisma/schema.prisma
```

## テストの実行

```bash
# 全てのテストを実行
pnpm test

# 認証テストのみを実行
pnpm test auth.test.ts

# ウォッチモードでテストを実行
pnpm test --watch
```

## テスト構成

### auth.test.ts

認証関連のAPIエンドポイントをテストします：

- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `POST /api/auth/logout` - ログアウト

#### テストケース

**ユーザー登録 (`POST /api/auth/register`)**
- ✅ 正常なデータでユーザー登録が成功する
- ✅ 既存ユーザーのメールアドレスで登録すると400エラーが返される
- ✅ 無効なデータで登録すると400エラーが返される
- ✅ 必須フィールドが不足している場合400エラーが返される

**ログイン (`POST /api/auth/login`)**
- ✅ 正しい認証情報でログインが成功する
- ✅ 存在しないメールアドレスで401エラーが返される
- ✅ 不正なパスワードで401エラーが返される
- ✅ 認証情報が不足している場合401エラーが返される

**ログアウト (`POST /api/auth/logout`)**
- ✅ 認証済みユーザーのログアウトが成功する
- ✅ 未認証ユーザーのアクセスで401エラーが返される
- ✅ ログアウト後にセッションがクリアされる

**統合テスト**
- ✅ 完全な認証フロー（登録 → ログイン → ログアウト）が正常に動作する

## ファイル構成

- `auth.test.ts` - 認証APIのテスト
- `app.ts` - テスト用アプリケーションファクトリ
- `setup.ts` - テスト用データベースセットアップとクリーンアップ
- `.env.test` - テスト環境用環境変数

## 注意事項

- テストは独立して実行されるよう、各テストの前後でデータベースをクリーンアップします
- セッション管理が必要なテストでは `request.agent()` を使用してセッションを維持します
- テスト用データベースは本番データベースとは別のものを使用してください
