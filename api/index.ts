import type { IncomingMessage, ServerResponse } from "node:http";
import { connectDB } from "../server/src/db";
import { createApp } from "../server/src/app";

/**
 * Vercel serverless entry point. Everything under /api/* is routed here and handed
 * to the same Express app the local dev server uses, so there is one code path.
 */
const app = createApp();

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await connectDB();
  } catch (error) {
    console.error("Database connection failed", error);
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Database unavailable, please try again shortly" }));
    return;
  }
  // An Express app is itself a (req, res) handler.
  (app as unknown as (req: IncomingMessage, res: ServerResponse) => void)(req, res);
}
