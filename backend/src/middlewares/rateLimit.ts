import { NextFunction, Request, Response } from "express";
import { env } from "../config/env.js";
import { errorResponse } from "../utils/apiResponse.js";

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || "unknown";
  const now = Date.now();
  const windowMs = env.RATE_LIMIT_WINDOW_MS;
  const maxRequests = env.RATE_LIMIT_MAX_REQUESTS;

  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return next();
  }

  if (current.count >= maxRequests) {
    const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
    res.setHeader("Retry-After", retryAfterSeconds.toString());
    return res.status(429).json(errorResponse("Rate limit exceeded", "RATE_LIMIT_EXCEEDED"));
  }

  current.count += 1;
  buckets.set(key, current);
  return next();
}
