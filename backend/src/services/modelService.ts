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
  { pattern: /analysis|reasoning|analytics/i, capabilities: ["reasoning"] },
  { pattern: /summary|summarization|summarize/i, capabilities: ["summarization"] }
];

function inverseMinMax(value: number, min: number, max: number): number {
  const safeValue = Number.isFinite(value) ? value : max;
  if (max <= min) return 1;
  const normalized = (safeValue - min) / (max - min);
  return Math.max(0, Math.min(1, 1 - normalized));
}

export class ModelService {
  constructor(
    private readonly modelRepository: ModelRepository,
    private readonly enrichmentAdapter: EnrichmentAdapter
  ) {}

  capabilityScore(model: ModelRecord, targetCapabilities: string[], queryTokens: string[]): number {
    if (targetCapabilities.length > 0) {
      const matches = targetCapabilities.filter((capability) => model.capabilities.includes(capability)).length;
      return matches / targetCapabilities.length;
    }

    if (queryTokens.length === 0) {
      return 0.5;
    }

    const searchable = `${model.name} ${model.provider} ${model.capabilities.join(" ")}`.toLowerCase();
    const overlap = queryTokens.filter((token) => searchable.includes(token)).length;
    return overlap / queryTokens.length;
  }

  priceScore(model: ModelRecord, minPrice: number, maxPrice: number): number {
    return inverseMinMax(model.price_per_1k_tokens, minPrice, maxPrice);
  }

  latencyScore(model: ModelRecord, minLatency: number, maxLatency: number, preferLowLatency = false): number {
    const normalized = inverseMinMax(model.latency, minLatency, maxLatency);
    return preferLowLatency ? Math.pow(normalized, 0.75) : normalized;
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
    const queryTokens = normalizedQuery
      .split(/\s+/)
      .map((token) => token.trim())
      .filter((token) => token.length >= 3);

    const { capabilities, preferLowLatency } = this.extractQuerySignals(normalizedQuery);

    const rawModels = await this.modelRepository.getAllModels();
    const models = await this.enrichmentAdapter.enrich(rawModels);

    if (models.length === 0) {
      return [];
    }

    const prices = models.map((model) => model.price_per_1k_tokens);
    const latencies = models.map((model) => model.latency);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const minLatency = Math.min(...latencies);
    const maxLatency = Math.max(...latencies);

    const weights = preferLowLatency
      ? { capability: 0.5, price: 0.2, latency: 0.3 }
      : { capability: 0.5, price: 0.3, latency: 0.2 };

    const scored = models.map((model) => {
      const capability = this.capabilityScore(model, capabilities, queryTokens);
      const price = this.priceScore(model, minPrice, maxPrice);
      const latency = this.latencyScore(model, minLatency, maxLatency, preferLowLatency);
      const score = capability * weights.capability + price * weights.price + latency * weights.latency;

      return {
        model,
        score: Number(score.toFixed(6)),
        score_breakdown: {
          capability: Number(capability.toFixed(6)),
          price: Number(price.toFixed(6)),
          latency: Number(latency.toFixed(6))
        }
      };
    });

    scored.sort((a, b) => b.score - a.score);

    return scored.map((entry, index) => {
      const strengths: Array<"cheap" | "fast" | "best match"> = [];
      if (entry.score_breakdown.price >= 0.75) strengths.push("cheap");
      if (entry.score_breakdown.latency >= 0.75) strengths.push("fast");
      if (index === 0 || entry.score_breakdown.capability >= 0.95) strengths.push("best match");

      const explanation = `Ranked highly due to ${
        entry.score_breakdown.capability >= 0.9 ? "strong capability match" : "partial capability match"
      }, ${entry.score_breakdown.latency >= 0.7 ? "low normalized latency" : "moderate latency"}, and ${
        entry.score_breakdown.price >= 0.7 ? "competitive normalized pricing" : "mid-to-high normalized pricing"
      }.`;

      return {
        model: entry.model,
        score: entry.score,
        explanation,
        strengths,
        score_breakdown: entry.score_breakdown
      };
    });
  }

  async getModelById(id: string): Promise<ModelRecord> {
    const model = await this.modelRepository.getModelById(id);

    if (!model) {
      throw new AppError(`Model '${id}' not found`, 404, "MODEL_NOT_FOUND");
    }

    return model;
  }
}
