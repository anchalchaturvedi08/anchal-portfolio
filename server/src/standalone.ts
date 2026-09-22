/**
 * Entry point for traditional Node hosting (cPanel "Setup Node.js App", a VPS, etc.).
 * One long-running process serves both the built site and the API.
 *
 * Only /api requests wait for the database, so the pages still load (and
 * /api/health can report the problem) even if MongoDB is unreachable.
 */
import http from "node:http";
import { config } from "./config";
import { connectDB } from "./db";
import { createApp } from "./app";

const app = createApp();
const needsDb = (url = "") => url.startsWith("/api") && !url.startsWith("/api/health");

// Connect at startup so the first visitor does not pay for it; failures are retried per request.
connectDB().then(
  () => console.log("MongoDB connected"),
  (error) => console.error("MongoDB connection failed:", error?.message ?? error)
);

// Passenger (used by cPanel) supplies PORT; locally it falls back to the configured port.
const port = Number(process.env.PORT) || config.port;

http
  .createServer(async (req, res) => {
    if (needsDb(req.url)) {
      try {
        await connectDB();
      } catch {
        res.statusCode = 503;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ message: "Database unavailable, please try again shortly" }));
        return;
      }
    }
    (app as unknown as http.RequestListener)(req, res);
  })
  .listen(port, () => console.log(`Portfolio running on port ${port}`));