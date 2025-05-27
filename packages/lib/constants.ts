// import "server-only";

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
export const ITEMS_PER_PAGE = 50;
export const SURVEYS_PER_PAGE = 12;
export const RESPONSES_PER_PAGE = 10;
export const TEXT_RESPONSES_PER_PAGE = 5;

export const DEBUG = env.DEBUG === "1";

// Billing constants

export enum PRODUCT_FEATURE_KEYS {
  FREE = "free",
  STARTUP = "startup",
  SCALE = "scale",
  ENTERPRISE = "enterprise",
}

export enum STRIPE_PRODUCT_NAMES {
  STARTUP = "Formbricks Startup",
  SCALE = "Formbricks Scale",
  ENTERPRISE = "Formbricks Enterprise",
}

export enum STRIPE_PRICE_LOOKUP_KEYS {
  STARTUP_MONTHLY = "formbricks_startup_monthly",
  STARTUP_YEARLY = "formbricks_startup_yearly",
  SCALE_MONTHLY = "formbricks_scale_monthly",
  SCALE_YEARLY = "formbricks_scale_yearly",
  UNLIMITED_99 = "formbricks_unlimited_99",
  UNLIMITED_199 = "formbricks_unlimited_199",
}

export const BILLING_LIMITS = {
  FREE: {
    RESPONSES: 500,
    MIU: 1000,
  },
  STARTUP: {
    RESPONSES: 2000,
    MIU: 2500,
  },
  SCALE: {
    RESPONSES: 5000,
    MIU: 20000,
  },
} as const;

export const DEFAULT_BRAND_COLOR = "#64748b";
