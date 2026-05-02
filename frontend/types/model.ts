export type Capability =
  | "chat"
  | "summarization"
  | "code generation"
  | "reasoning"
  | "multimodal"
  | "translation"
  | "agents";

export interface LlmModel {
  id: string;
  name: string;
  provider: string;
  capabilities: string[];
  price_per_1k_tokens: number;
  context_window: number;
  latency: number;
  documentation_url: string;
}

export interface RankedModel {
  model: LlmModel;
  score: number;
  explanation: string;
  strengths: Array<"cheap" | "fast" | "best match">;
  score_breakdown: {
    capability: number;
    price: number;
    latency: number;
  };
}
