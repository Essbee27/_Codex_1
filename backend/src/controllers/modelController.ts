import { Request, Response } from "express";
import { z } from "zod";
import { ModelService } from "../services/modelService.js";
import { successResponse } from "../utils/apiResponse.js";

const searchQueryOutput = z.object({ query: z.string() });
const modelParamsSchema = z.object({ id: z.string().trim().min(1) });

export class ModelController {
  constructor(private readonly modelService: ModelService) {}

  search = async (req: Request, res: Response) => {
    const { query } = searchQueryOutput.parse(req.query);
    const models = await this.modelService.searchModels(query);

    return res.status(200).json(successResponse(models));
  };

  getById = async (req: Request, res: Response) => {
    const { id } = modelParamsSchema.parse(req.params);
    const model = await this.modelService.getModelById(id);

    return res.status(200).json(successResponse(model));
  };
}
