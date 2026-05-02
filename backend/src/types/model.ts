export interface ModelRecord {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  price_per_1k_tokens: number;
  context_window: number;
  latency: number;
  documentation_url: string;
}

export interface ScoredModel {
  model: ModelRecord;
  score: number;
  explanation: string;
  strengths: Array<"cheap" | "fast" | "best match">;
  score_breakdown: {
    capability: number;
    price: number;
    latency: number;
  };
}
