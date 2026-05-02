export type Capability =
  | "chat"
  | "summarization"
  | "code generation"
  | "reasoning"
  | "multimodal"
  | "translation"
  | "agents";

export type Provider =
  | "OpenAI"
  | "Hugging Face"
  | "Google Vertex AI"
  | "Amazon Bedrock"
  | "Azure OpenAI";

export interface LlmModel {
  id: string;
  name: string;
  provider: Provider;
  capabilities: Capability[];
  price_per_1k_tokens: number;
  context_window: number;
  latency: number;
  description: string;
  documentation_url: string;
}

export interface ScoredModel {
  model: LlmModel;
  relevanceScore: number;
}
