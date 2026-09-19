/**
 * Zero-setup dev server: starts an in-memory MongoDB, seeds it and runs the API.
 * Data is lost on exit — use a real MONGODB_URI (`npm run dev`) for anything lasting.
 */
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { config } from "./config";
import { createApp } from "./app";
import { seed } from "./seed";

const mongo = await MongoMemoryServer.create();
await mongoose.connect(mongo.getUri("portfolio"));
await seed();
createApp().listen(config.port, () =>
  console.log(`API (in-memory DB) on http://localhost:${config.port} — admin: ${config.adminEmail}`)
);
