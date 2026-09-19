import { z } from "zod";

const url = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//i.test(v), {
    message: "Must be an http(s) URL or a /path",
  });
const text = (max: number) => z.string().trim().max(max);
const list = (max: number) => z.array(text(max)).max(30);

export const profileInput = z.object({
  name: text(80).min(1),
  role: text(120),
  tagline: text(300),
  location: text(120),
  email: z.union([z.literal(""), z.email()]),
  available: z.boolean(),
  availabilityText: text(80),
  about: list(1000),
  currentlyLearning: list(60),
  resumeUrl: url,
  avatarUrl: url,
  stats: z
    .array(z.object({ value: z.number().min(0).max(1_000_000), suffix: text(5), label: text(60) }))
    .max(8),
  socials: z.array(z.object({ name: text(30).min(1), url })).max(12),
});

export const projectInput = z.object({
  title: text(120).min(1),
  description: text(1000),
  tech: list(40),
  image: url,
  liveLink: url,
  githubLink: url,
  featured: z.boolean(),
  order: z.number().int().min(-1000).max(1000),
});

export const skillInput = z.object({
  name: text(60).min(1),
  category: text(60),
  order: z.number().int().min(-1000).max(1000),
});

export const experienceInput = z.object({
  title: text(120).min(1),
  company: text(120),
  date: text(60),
  summary: text(600),
  points: list(400),
  order: z.number().int().min(-1000).max(1000),
});

export const messageInput = z.object({
  name: text(80).min(1, "Please enter your name"),
  email: z.email("Please enter a valid email"),
  message: text(3000).min(10, "Message should be at least 10 characters"),
  // Honeypot: real users never fill this hidden field.
  website: z.string().max(200).optional(),
});

export const loginInput = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
});
