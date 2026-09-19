import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "node:path";
import fs from "node:fs";
import { config } from "./config";
import { Experience, Profile, Project, Skill } from "./models/index";
import { experienceInput, projectInput, skillInput } from "./schemas";
import { crudRouter } from "./lib/crud";
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import messageRoutes from "./routes/messages";
import { errorHandler, notFound } from "./middleware/error";

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1); // correct client IPs behind Render/Railway/Nginx
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // Project screenshots and avatars may be hosted anywhere over https.
          "img-src": ["'self'", "data:", "https:"],
        },
      },
    })
  );
  app.use(cors({ origin: config.clientOrigins }));
  app.use(express.json({ limit: "100kb" }));

  app.get("/api/health", (_req, res) => res.json({ ok: true }));

  // One round-trip for the whole public page.
  app.get("/api/portfolio", async (_req, res) => {
    const [profile, projects, skills, experience] = await Promise.all([
      Profile.findOne(),
      Project.find().sort({ order: 1, createdAt: -1 }),
      Skill.find().sort({ order: 1, createdAt: 1 }),
      Experience.find().sort({ order: 1, createdAt: -1 }),
    ]);
    res.set("Cache-Control", "public, max-age=60");
    res.json({ profile, projects, skills, experience });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/profile", profileRoutes);
  app.use("/api/projects", crudRouter(Project, projectInput));
  app.use("/api/skills", crudRouter(Skill, skillInput));
  app.use("/api/experience", crudRouter(Experience, experienceInput));
  app.use("/api/messages", messageRoutes);
  app.use("/api", notFound);

  // Local production preview: if the client has been built, serve it from here too.
  // On Vercel the static files are served by the platform, so this is skipped.
  if (!process.env.VERCEL) {
    const clientDist = [
      path.resolve(process.cwd(), "client/dist"),
      path.resolve(process.cwd(), "../client/dist"),
    ].find((dir) => fs.existsSync(path.join(dir, "index.html")));

    if (clientDist) {
      app.use(express.static(clientDist, { maxAge: "1h", index: false }));
      app.get("/{*splat}", (_req, res) => res.sendFile(path.join(clientDist, "index.html")));
    }
  }

  app.use(errorHandler);
  return app;
};
