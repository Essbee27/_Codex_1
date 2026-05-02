import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { errorResponse } from "../utils/apiResponse.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(400).json(
      errorResponse(
        `Validation failed: ${err.issues.map((issue) => issue.message).join(", ")}`,
        "VALIDATION_ERROR"
      )
    );
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(errorResponse(err.message, err.code));
  }

  logger.error("Unhandled server error", { err });
  return res.status(500).json(errorResponse("Unexpected server error", "INTERNAL_ERROR"));
}
