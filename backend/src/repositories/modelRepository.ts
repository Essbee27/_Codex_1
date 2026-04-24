import { getSupabaseClient } from "../config/supabase.js";
import { ModelRecord } from "../types/model.js";
import { AppError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { mockModels } from "./mockModels.js";

export class ModelRepository {
  private readonly supabase = getSupabaseClient();

  async getAllModels(): Promise<ModelRecord[]> {
    if (!this.supabase) {
      logger.warn("Supabase is not configured. Using in-memory mock model dataset.");
      return mockModels;
    }

    const { data, error } = await this.supabase
      .from("models")
      .select("id,name,provider,capabilities,price_per_1k_tokens,context_window,latency,documentation_url,created_at");

    if (error) {
      logger.error("Supabase query failed for getAllModels. Falling back to mock dataset.", {
        errorMessage: error.message,
        errorCode: error.code
      });
      return mockModels;
    }

    return (data || []).map((model) => ({
      ...model,
      capabilities: model.capabilities || []
    })) as ModelRecord[];
  }

  async getModelById(id: string): Promise<ModelRecord | null> {
    if (!this.supabase) {
      return mockModels.find((model) => model.id === id) || null;
    }

    const { data, error } = await this.supabase
      .from("models")
      .select("id,name,provider,capabilities,price_per_1k_tokens,context_window,latency,documentation_url,created_at")
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

    return {
      ...data,
      capabilities: data.capabilities || []
    } as ModelRecord;
  }

  async assertHealthy(): Promise<void> {
    if (!this.supabase) {
      return;
    }

    const { error } = await this.supabase.from("models").select("id").limit(1);

    if (error) {
      throw new AppError("Database connectivity check failed", 503, "DB_UNAVAILABLE");
    }
  }
}
