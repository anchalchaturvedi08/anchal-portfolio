import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { HttpError } from "./error";

export interface AuthPayload {
  sub: string;
  email: string;
}

export const signToken = (payload: AuthPayload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw new HttpError(401, "Authentication required");
  try {
    res.locals.user = jwt.verify(token, config.jwtSecret) as AuthPayload;
    next();
  } catch {
    throw new HttpError(401, "Session expired, please sign in again");
  }
};
