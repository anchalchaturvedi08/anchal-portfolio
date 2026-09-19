import mongoose from "mongoose";
import { config } from "./config";

/**
 * A serverless function may be invoked many times on the same warm instance, and
 * opening a connection per request would exhaust the Atlas connection limit. The
 * promise is cached on globalThis so it survives module re-evaluation.
 */
declare global {
  // eslint-disable-next-line no-var
  var __portfolioMongo: Promise<typeof mongoose> | undefined;
}

export const connectDB = () => {
  if (!globalThis.__portfolioMongo) {
    globalThis.__portfolioMongo = mongoose
      .connect(config.mongoUri, { maxPoolSize: 5, serverSelectionTimeoutMS: 5000 })
      .catch((error) => {
        // Never cache a failure, or every later request on this instance would
        // reuse the rejected promise and the API would stay down until recycled.
        globalThis.__portfolioMongo = undefined;
        throw error;
      });
  }
  return globalThis.__portfolioMongo;
};
