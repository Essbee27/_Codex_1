import { ModelRecord } from "../types/model.js";

export const mockModels: ModelRecord[] = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    capabilities: ["chat", "reasoning", "code generation"],
    price_per_1k_tokens: 0.005,
    context_window: 128000,
    latency: 580,
    documentation_url: "https://platform.openai.com/docs/models"
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google Vertex AI",
    capabilities: ["chat", "reasoning", "summarization", "code generation"],
    price_per_1k_tokens: 0.0045,
    context_window: 1000000,
    latency: 730,
    documentation_url: "https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference"
  },
  {
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Amazon Bedrock",
    capabilities: ["chat", "summarization", "reasoning"],
    price_per_1k_tokens: 0.002,
    context_window: 200000,
    latency: 410,
    documentation_url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html"
  }
];
