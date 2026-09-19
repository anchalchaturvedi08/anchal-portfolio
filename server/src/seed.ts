import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { config } from "./config";
import { Experience, Profile, Project, Skill, User } from "./models/index";
import * as data from "./seedData";

/**
 * Safe to re-run: content collections are only filled when empty, so edits made
 * in the admin panel are never overwritten. Use `npm run seed -- --reset` to wipe
 * content and start again. The admin password is (re)set from .env each time.
 */
export const seed = async (reset = false) => {
  if (reset) {
    await Profile.deleteMany({});
    await Project.deleteMany({});
    await Skill.deleteMany({});
    await Experience.deleteMany({});
  }
  if (!(await Profile.countDocuments())) await Profile.create(data.profile);
  if (!(await Project.countDocuments())) await Project.insertMany(data.projects);
  if (!(await Skill.countDocuments())) await Skill.insertMany(data.skills);
  if (!(await Experience.countDocuments())) await Experience.insertMany(data.experience);

  const passwordHash = await bcrypt.hash(config.adminPassword, 12);
  await User.findOneAndUpdate(
    { email: config.adminEmail.toLowerCase() },
    { passwordHash },
    { upsert: true }
  );
};

const runDirectly = /seed\.(ts|js)$/.test(process.argv[1] ?? "");
if (runDirectly) {
  await mongoose.connect(config.mongoUri);
  await seed(process.argv.includes("--reset"));
  console.log(`Seed complete. Admin login: ${config.adminEmail}`);
  await mongoose.disconnect();
}
