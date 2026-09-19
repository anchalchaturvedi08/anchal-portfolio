import { Schema, model, type InferSchemaType } from "mongoose";

const toJSON = {
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    ret.id = String(ret._id);
    delete ret._id;
    delete ret.passwordHash;
    return ret;
  },
};

/* ---------- Profile (single document) ---------- */
const profileSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, default: "" },
    tagline: { type: String, default: "" },
    location: { type: String, default: "" },
    email: { type: String, default: "" },
    available: { type: Boolean, default: true },
    availabilityText: { type: String, default: "Open to opportunities" },
    about: { type: [String], default: [] },
    currentlyLearning: { type: [String], default: [] },
    resumeUrl: { type: String, default: "" },
    avatarUrl: { type: String, default: "" },
    stats: { type: [{ _id: false, value: Number, suffix: String, label: String }], default: [] },
    socials: { type: [{ _id: false, name: String, url: String }], default: [] },
  },
  { timestamps: true, toJSON }
);

/* ---------- Project ---------- */
const projectSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    tech: { type: [String], default: [] },
    image: { type: String, default: "" },
    liveLink: { type: String, default: "" },
    githubLink: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON }
);

/* ---------- Skill ---------- */
const skillSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "Other" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON }
);

/* ---------- Experience ---------- */
const experienceSchema = new Schema(
  {
    title: { type: String, required: true },
    company: { type: String, default: "" },
    date: { type: String, default: "" },
    summary: { type: String, default: "" },
    points: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON }
);

/* ---------- Contact message ---------- */
const messageSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON }
);

/* ---------- Admin user ---------- */
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true, toJSON }
);

export type ProfileDoc = InferSchemaType<typeof profileSchema>;

export const Profile = model("Profile", profileSchema);
export const Project = model("Project", projectSchema);
export const Skill = model("Skill", skillSchema);
export const Experience = model("Experience", experienceSchema);
export const Message = model("Message", messageSchema);
export const User = model("User", userSchema);
