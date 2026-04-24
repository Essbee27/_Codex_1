import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.js";

export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    logger.info("HTTP request completed", {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - start
    });
  });

  next();
}
