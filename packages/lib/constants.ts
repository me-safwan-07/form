import "server-only";
import { env } from "./env";

// URLs
export const WEBAPP_URL = env.WEBAPP_URL;
//   env.WEBAPP_URL || (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : false) || "http://localhost:3000";

export const GOOGLE_CLIENT_ID = env.GOOGLE_CLIENT_ID;
export const GOOGLE_CLIENT_SECRET = env.GOOGLE_CLIENT_SECRET;

export const SMTP_HOST = env.SMTP_HOST;
export const SMTP_PORT = env.SMTP_PORT;
export const SMTP_SECURE_ENABLED = env.SMTP_SECURE_ENABLED === "1";
export const SMTP_USER = env.SMTP_USER;
export const SMTP_PASSWORD = env.SMTP_PASSWORD;
export const MAIL_FROM = env.MAIL_FROM;

export const NEXTAUTH_SECRET = env.NEXTAUTH_SECRET;

export const DEBUG = env.DEBUG === "1";
