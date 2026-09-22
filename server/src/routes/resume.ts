import express, { Router } from "express";
import { Profile, Resume } from "../models/index";
import { requireAuth } from "../middleware/auth";
import { HttpError } from "../middleware/error";

const router = Router();
const MAX_BYTES = 5 * 1024 * 1024;

/** "Anchal Chaturvedi" -> "Anchal-Chaturvedi-Resume.pdf" */
const fileName = async () => {
  const profile = await Profile.findOne().select("name");
  const base = (profile?.name ?? "").trim().replace(/[^A-Za-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${base || "Resume"}${base ? "-Resume" : ""}.pdf`;
};

/** Public metadata, used by the admin panel. */
router.get("/meta", async (_req, res) => {
  const doc = await Resume.findOne().select("size updatedAt");
  res.json(doc ? { size: doc.size, updatedAt: doc.updatedAt } : null);
});

/**
 * The PDF itself.  /api/resume            -> shown in the browser (used by the viewer)
 *                  /api/resume?download=1 -> saved as a file
 */
router.get("/", async (req, res) => {
  const doc = await Resume.findOne();
  if (!doc) throw new HttpError(404, "No résumé has been uploaded yet");

  const download = typeof req.query.download === "string" && req.query.download !== "0";
  // Browsers' built-in PDF viewers can be blocked by the site-wide CSP; a PDF has no
  // scripts of ours to protect, so the policy is dropped for this one response.
  res.removeHeader("Content-Security-Policy");
  res.set({
    "Content-Type": "application/pdf",
    "Content-Length": String(doc.size),
    "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${await fileName()}"`,
    // The viewer adds ?v=<updatedAt>, so a replaced file is never served stale.
    "Cache-Control": "public, max-age=300",
    "Last-Modified": doc.updatedAt.toUTCString(),
  });
  res.send(doc.data);
});

/** Upload or replace. Body is the raw PDF bytes (Content-Type: application/pdf). */
router.put(
  "/",
  requireAuth, // checked before the body is read, so anonymous uploads cost nothing
  express.raw({ type: "application/pdf", limit: MAX_BYTES }),
  async (req, res) => {
    const body = req.body as unknown;
    if (!Buffer.isBuffer(body) || body.length === 0) {
      throw new HttpError(400, "Send the résumé as a PDF file");
    }
    // Every PDF starts with "%PDF-"; this rejects renamed images, Word files, etc.
    if (body.subarray(0, 5).toString("latin1") !== "%PDF-") {
      throw new HttpError(400, "That file is not a valid PDF");
    }
    const doc = await Resume.findOneAndUpdate(
      {},
      { data: body, size: body.length, contentType: "application/pdf" },
      { upsert: true, new: true, setDefaultsOnInsert: true, projection: { data: 0 } }
    );
    res.json({ size: doc.size, updatedAt: doc.updatedAt });
  }
);

router.delete("/", requireAuth, async (_req, res) => {
  await Resume.deleteMany({});
  res.status(204).end();
});

export default router;