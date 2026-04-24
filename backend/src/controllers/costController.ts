import { Request, Response } from "express";
import { z } from "zod";
import { CostService } from "../services/costService.js";
import { successResponse } from "../utils/apiResponse.js";

const costRequestSchema = z.object({
  model_id: z.string().trim().min(1),
  monthly_tokens: z.number().positive()
});

export class CostController {
  constructor(private readonly costService: CostService) {}

  estimate = async (req: Request, res: Response) => {
    const payload = costRequestSchema.parse(req.body);
    const estimatedCost = await this.costService.estimateCost(payload.model_id, payload.monthly_tokens);

    return res.status(200).json(successResponse({ estimated_cost: estimatedCost }));
  };
}
