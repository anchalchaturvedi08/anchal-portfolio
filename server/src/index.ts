import mongoose from "mongoose";
import { config } from "./config";
import { connectDB } from "./db";
import { createApp } from "./app";

await connectDB();
console.log("MongoDB connected");

const server = createApp().listen(config.port, () =>
  console.log(`API listening on http://localhost:${config.port}`)
);

const shutdown = async () => {
  server.close();
  await mongoose.disconnect();
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
