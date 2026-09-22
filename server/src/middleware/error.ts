import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export const notFound = (_req: Request, _res: Response, next: NextFunction) =>
  next(new HttpError(404, "Route not found"));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: err.issues[0]?.message ?? "Invalid input",
      issues: err.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(404).json({ message: "Not found" });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ message: err.message });
  }
  if ((err as { type?: string })?.type === "entity.too.large") {
    return res.status(413).json({ message: "File is too large" });
  }
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ message: "Malformed JSON" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
};