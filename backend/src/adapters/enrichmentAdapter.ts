import axios from "axios";
import { env } from "../config/env.js";
import { ModelRecord } from "../types/model.js";
import { logger } from "../utils/logger.js";

interface EnrichedModel {
  id: string;
  latency?: number;
  price_per_1k_tokens?: number;
}

export class EnrichmentAdapter {
  async enrich(models: ModelRecord[]): Promise<ModelRecord[]> {
    if (!env.ENRICHMENT_API_BASE_URL || !env.ENRICHMENT_API_KEY) {
      return models;
    }

    try {
      const response = await axios.post<EnrichedModel[]>(
        `${env.ENRICHMENT_API_BASE_URL}/models/enrich`,
        { model_ids: models.map((m) => m.id) },
        {
          timeout: 500,
          headers: {
            Authorization: `Bearer ${env.ENRICHMENT_API_KEY}`
          }
        }
      );

      const map = new Map(response.data.map((item) => [item.id, item]));

      return models.map((model) => {
        const extra = map.get(model.id);

        return {
          ...model,
          latency: extra?.latency ?? model.latency,
          price_per_1k_tokens: extra?.price_per_1k_tokens ?? model.price_per_1k_tokens
        };
      });
    } catch (_error) {
      logger.warn("Model enrichment failed, falling back to DB values");
      return models;
    }
  }
}
