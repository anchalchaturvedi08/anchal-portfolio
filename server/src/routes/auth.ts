import { Router } from "express";
import bcrypt from "bcryptjs";
import rateLimit from "express-rate-limit";
import { User } from "../models/index";
import { loginInput } from "../schemas";
import { requireAuth, signToken } from "../middleware/auth";
import { HttpError } from "../middleware/error";

const router = Router();

// Slow down password guessing: 10 attempts per 15 minutes per IP.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many attempts, try again later" },
});

router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = loginInput.parse(req.body);
  const user = await User.findOne({ email: email.toLowerCase() });
  // Always run a hash comparison so response time does not reveal whether the email exists.
  const hash = user?.passwordHash ?? "$2b$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidi";
  const ok = await bcrypt.compare(password, hash);
  if (!user || !ok) throw new HttpError(401, "Invalid email or password");
  res.json({ token: signToken({ sub: user.id, email: user.email }), email: user.email });
});

router.get("/me", requireAuth, (_req, res) => {
  res.json({ email: res.locals.user.email });
});

export default router;
