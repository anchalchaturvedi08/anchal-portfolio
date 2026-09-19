import { Router } from "express";
import rateLimit from "express-rate-limit";
import { Message } from "../models/index";
import { messageInput } from "../schemas";
import { requireAuth } from "../middleware/auth";
import { sendContactNotification } from "../mailer";
import { HttpError } from "../middleware/error";

const router = Router();

// Contact form: 5 messages per hour per IP.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many messages sent, please try again later" },
});

router.post("/", contactLimiter, async (req, res) => {
  const { website, ...data } = messageInput.parse(req.body);
  // Honeypot filled => bot. Pretend success, store nothing.
  if (!website) {
    await Message.create(data);
    // Storing the message is what matters; the email is a best-effort notification.
    // A failing or slow mail server must never turn a delivered message into an
    // error for the visitor, so failures are logged and a slow send is abandoned.
    await Promise.race([
      sendContactNotification(data).catch((error) => console.error("Contact email failed:", error)),
      new Promise((resolve) => setTimeout(resolve, 8000).unref?.()),
    ]);
  }
  res.status(201).json({ ok: true });
});

router.get("/", requireAuth, async (_req, res) => {
  res.json(await Message.find().sort({ createdAt: -1 }).limit(500));
});

router.patch("/:id/read", requireAuth, async (req, res) => {
  const read = req.body?.read !== false;
  const doc = await Message.findByIdAndUpdate(req.params.id, { read }, { new: true });
  if (!doc) throw new HttpError(404, "Not found");
  res.json(doc);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const doc = await Message.findByIdAndDelete(req.params.id);
  if (!doc) throw new HttpError(404, "Not found");
  res.status(204).end();
});

export default router;