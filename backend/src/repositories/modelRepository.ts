import { supabase } from "../config/supabase.js";
import { ModelRecord } from "../types/model.js";
import { AppError } from "../utils/errors.js";

export class ModelRepository {
  async getAllModels(): Promise<ModelRecord[]> {
    const { data, error } = await supabase
      .from("models")
      .select("id,name,provider,capabilities,price_per_1k_tokens,context_window,latency,documentation_url,created_at");

    if (error) {
      throw new AppError("Failed to fetch models", 500, "DB_FETCH_FAILED");
    }

    return (data || []).map((model) => ({
      ...model,
      capabilities: model.capabilities || []
    })) as ModelRecord[];
  }

  async getModelById(id: string): Promise<ModelRecord | null> {
    const { data, error } = await supabase
      .from("models")
      .select("id,name,provider,capabilities,price_per_1k_tokens,context_window,latency,documentation_url,created_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new AppError("Failed to fetch model", 500, "DB_FETCH_FAILED");
    }

    if (!data) {
      return null;
    }

    return {
      ...data,
      capabilities: data.capabilities || []
    } as ModelRecord;
  }
}
