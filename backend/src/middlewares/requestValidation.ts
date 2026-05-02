import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const searchQuerySchema = z.object({
  query: z.string().trim().min(1, "query is required")
});

export const costEstimateSchema = z.object({
  model_id: z.string().trim().min(1, "model_id is required"),
  monthly_tokens: z.number().positive("monthly_tokens must be greater than 0")
});

export function validateQuery<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.query = schema.parse(req.query);
    next();
  };
}

export function validateBody<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body);
    next();
  };
}
