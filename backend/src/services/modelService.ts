import { EnrichmentAdapter } from "../adapters/enrichmentAdapter.js";
import { ModelRepository } from "../repositories/modelRepository.js";
import { ModelRecord, ScoredModel } from "../types/model.js";
import { AppError } from "../utils/errors.js";

const QUERY_CAPABILITY_MAP: Array<{
  pattern: RegExp;
  capabilities: string[];
  preferLowLatency?: boolean;
}> = [
  { pattern: /customer support|support chatbot|help desk/i, capabilities: ["chat"], preferLowLatency: true },
  { pattern: /coding|code generation|developer/i, capabilities: ["code generation"] },
  { pattern: /analysis|reasoning|analytics/i, capabilities: ["reasoning"] }
];

export class ModelService {
  constructor(
    private readonly modelRepository: ModelRepository,
    private readonly enrichmentAdapter: EnrichmentAdapter
  ) {}

  capabilityScore(model: ModelRecord, targetCapabilities: string[]): number {
    if (!targetCapabilities.length) return 0.5;

    const matches = targetCapabilities.filter((capability) => model.capabilities.includes(capability)).length;
    return matches / targetCapabilities.length;
  }

  priceScore(model: ModelRecord, maxPrice: number): number {
    if (maxPrice <= 0) return 1;
    return Math.max(0, 1 - model.price_per_1k_tokens / maxPrice);
  }

  latencyScore(model: ModelRecord, maxLatency: number, preferLowLatency = false): number {
    if (maxLatency <= 0) return 1;
    const normalized = Math.max(0, 1 - model.latency / maxLatency);
    return preferLowLatency ? Math.min(1, normalized + 0.15) : normalized;
  }

  private extractQuerySignals(query: string): { capabilities: string[]; preferLowLatency: boolean } {
    const capabilities = new Set<string>();
    let preferLowLatency = false;

    QUERY_CAPABILITY_MAP.forEach((mapping) => {
      if (mapping.pattern.test(query)) {
        mapping.capabilities.forEach((capability) => capabilities.add(capability));
        if (mapping.preferLowLatency) {
          preferLowLatency = true;
        }
      }
    });

    return {
      capabilities: [...capabilities],
      preferLowLatency
    };
  }

  async searchModels(query: string): Promise<ScoredModel[]> {
    const normalizedQuery = query.trim().toLowerCase();
    const { capabilities, preferLowLatency } = this.extractQuerySignals(normalizedQuery);

    const rawModels = await this.modelRepository.getAllModels();
    const models = await this.enrichmentAdapter.enrich(rawModels);

    const maxPrice = Math.max(...models.map((model) => model.price_per_1k_tokens), 1);
    const maxLatency = Math.max(...models.map((model) => model.latency), 1);

    const scored = models.map((model) => {
      const capability_match = this.capabilityScore(model, capabilities);
      const price_score = this.priceScore(model, maxPrice);
      const latency_score = this.latencyScore(model, maxLatency, preferLowLatency);

      const relevance_score = capability_match * 0.5 + price_score * 0.3 + latency_score * 0.2;

      return {
        ...model,
        relevance_score: Number(relevance_score.toFixed(6))
      };
    });

    return scored.sort((a, b) => b.relevance_score - a.relevance_score);
  }

  async getModelById(id: string): Promise<ModelRecord> {
    const model = await this.modelRepository.getModelById(id);

    if (!model) {
      throw new AppError(`Model '${id}' not found`, 404, "MODEL_NOT_FOUND");
    }

    return model;
  }
}
