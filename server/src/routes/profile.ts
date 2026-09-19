import { Router } from "express";
import { Profile } from "../models/index";
import { profileInput } from "../schemas";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", async (_req, res) => {
  res.json(await Profile.findOne());
});

router.put("/", requireAuth, async (req, res) => {
  const data = profileInput.parse(req.body);
  const doc = await Profile.findOneAndUpdate({}, data, {
    new: true,
    upsert: true,
    runValidators: true,
    setDefaultsOnInsert: true,
  });
  res.json(doc);
});

export default router;
