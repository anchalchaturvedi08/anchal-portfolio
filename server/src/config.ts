import "dotenv/config";

const required = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

const isProd = process.env.NODE_ENV === "production";

export const config = {
  isProd,
  port: Number(process.env.PORT ?? 5000),
  mongoUri: required("MONGODB_URI", "mongodb://127.0.0.1:27017/portfolio"),
  // In production a real secret is mandatory; in dev a default keeps setup friction low.
  jwtSecret: required("JWT_SECRET", isProd ? undefined : "dev-only-secret"),
  adminEmail: process.env.ADMIN_EMAIL ?? "admin@example.com",
  adminPassword: process.env.ADMIN_PASSWORD ?? "change-this-password",
  smtp: {
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT ?? 465),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    // Where notifications land; defaults to the sending account itself.
    to: process.env.CONTACT_TO || process.env.SMTP_USER || "",
  },
  clientOrigins: (process.env.CLIENT_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};