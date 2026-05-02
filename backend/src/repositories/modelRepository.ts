import { getSupabaseClient } from "../config/supabase.js";
import { ModelRecord } from "../types/model.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { mockModels } from "./mockModels.js";

type RawModel = Partial<ModelRecord> & { capabilities?: unknown };

function normalizeModel(raw: RawModel): ModelRecord {
  return {
    id: String(raw.id ?? "unknown-model"),
    name: String(raw.name ?? "Unknown Model"),
    provider: String(raw.provider ?? "Unknown Provider"),
    capabilities: Array.isArray(raw.capabilities)
      ? raw.capabilities.filter((item): item is string => typeof item === "string")
      : [],
    price_per_1k_tokens: Number(raw.price_per_1k_tokens ?? 0),
    context_window: Number(raw.context_window ?? 0),
    latency: Number(raw.latency ?? 0),
    documentation_url: String(raw.documentation_url ?? "https://example.com/docs")
  };
}

export class ModelRepository {
  private async resolveClient() {
    return getSupabaseClient();
  }

  async getAllModels(): Promise<ModelRecord[]> {
    const supabase = await this.resolveClient();

    if (!supabase) {
      logger.warn("Supabase is not configured. Using in-memory mock model dataset.");
      return mockModels;
    }

    const { data, error } = await supabase
      .from("models")
      .select("id,name,provider,capabilities,price_per_1k_tokens,context_window,latency,documentation_url");

    if (error) {
      logger.error("Supabase query failed for getAllModels. Falling back to mock dataset.", {
        errorMessage: error.message,
        errorCode: error.code
      });
      return mockModels;
    }

    return (data || []).map((model: RawModel) => normalizeModel(model));
  }

  async getModelById(id: string): Promise<ModelRecord | null> {
    const supabase = await this.resolveClient();

    if (!supabase) {
      return mockModels.find((model) => model.id === id) || null;
    }

    const { data, error } = await supabase
      .from("models")
      .select("id,name,provider,capabilities,price_per_1k_tokens,context_window,latency,documentation_url")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      logger.error("Supabase query failed for getModelById. Trying mock dataset fallback.", {
        errorMessage: error.message,
        errorCode: error.code,
        modelId: id
      });
      return mockModels.find((model) => model.id === id) || null;
    }

    if (!data) {
      return null;
    }

    return normalizeModel(data as RawModel);
  }

  async assertHealthy(): Promise<void> {
    const supabase = await this.resolveClient();

    if (!supabase) {
      return;
    }

    const { error } = await supabase.from("models").select("id").limit(1);

    if (error) {
      throw new AppError("Database connectivity check failed", 503, "DB_UNAVAILABLE");
    }
  }
}
