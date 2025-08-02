import * as dotenv from "dotenv";
dotenv.config();

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === "") {
    console.error(`Environment variable ${key} is required but not set.`);
    process.exit(1);
  }
  return value;
}

export const PORT = 8000;
export const SESSION_SECRET = getRequiredEnv("SESSION_SECRET");
