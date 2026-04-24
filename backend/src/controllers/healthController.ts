import { Request, Response } from "express";
import { hasSupabaseConfig } from "../config/env.js";
import { ModelRepository } from "../repositories/modelRepository.js";
import { successResponse } from "../utils/apiResponse.js";

export class HealthController {
  constructor(private readonly modelRepository: ModelRepository) {}

  check = async (_req: Request, res: Response) => {
    let database = hasSupabaseConfig ? "connected" : "mock-fallback";

    if (hasSupabaseConfig) {
      try {
        await this.modelRepository.assertHealthy();
      } catch {
        database = "degraded-fallback";
      }
    }

    return res.status(200).json(
      successResponse({
        status: "ok",
        database
      })
    );
  };
}
