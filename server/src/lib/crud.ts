import { Router } from "express";
import type { Model } from "mongoose";
import type { ZodType } from "zod";
import { requireAuth } from "../middleware/auth";
import { HttpError } from "../middleware/error";

/**
 * Builds a REST router for an ordered collection:
 *   GET /        public list (sorted by `order`, then newest)
 *   POST /       admin create
 *   PUT /:id     admin replace
 *   DELETE /:id  admin remove
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const crudRouter = (model: Model<any>, schema: ZodType) => {
  const router = Router();

  router.get("/", async (_req, res) => {
    res.json(await model.find().sort({ order: 1, createdAt: -1 }));
  });

  router.post("/", requireAuth, async (req, res) => {
    res.status(201).json(await model.create(schema.parse(req.body)));
  });

  router.put("/:id", requireAuth, async (req, res) => {
    const doc = await model.findByIdAndUpdate(req.params.id, schema.parse(req.body) as object, {
      new: true,
      runValidators: true,
    });
    if (!doc) throw new HttpError(404, "Not found");
    res.json(doc);
  });

  router.delete("/:id", requireAuth, async (req, res) => {
    const doc = await model.findByIdAndDelete(req.params.id);
    if (!doc) throw new HttpError(404, "Not found");
    res.status(204).end();
  });

  return router;
};
