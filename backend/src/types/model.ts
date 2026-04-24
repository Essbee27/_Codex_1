export interface ModelRecord {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  price_per_1k_tokens: number;
  context_window: number;
  latency: number;
  documentation_url: string;
  created_at?: string;
}

export interface ScoredModel extends ModelRecord {
  relevance_score: number;
}
