import { ModelRepository } from "../repositories/modelRepository.js";
import { AppError } from "../utils/errors.js";

export class CostService {
  constructor(private readonly modelRepository: ModelRepository) {}

  async estimateCost(modelId: string, monthlyTokens: number): Promise<number> {
    const model = await this.modelRepository.getModelById(modelId);

    if (!model) {
      throw new AppError(`Model '${modelId}' not found`, 404, "MODEL_NOT_FOUND");
    }

    const normalizedPrice = model.price_per_1k_tokens;
    const estimated = (monthlyTokens / 1000) * normalizedPrice;

    return Number(estimated.toFixed(4));
  }
}
