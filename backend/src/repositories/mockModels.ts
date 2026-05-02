import { ModelRecord } from "../types/model.js";

export const mockModels: ModelRecord[] = [
  {
    id: "openai-gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    capabilities: ["chat", "reasoning", "code generation", "summarization"],
    price_per_1k_tokens: 0.005,
    context_window: 128000,
    latency: 560,
    documentation_url: "https://platform.openai.com/docs/models"
  },
  {
    id: "openai-gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    capabilities: ["chat", "summarization", "code generation"],
    price_per_1k_tokens: 0.0016,
    context_window: 128000,
    latency: 430,
    documentation_url: "https://platform.openai.com/docs/models"
  },
  {
    id: "openai-gpt-4-1",
    name: "GPT-4.1",
    provider: "OpenAI",
    capabilities: ["reasoning", "code generation", "agents", "chat"],
    price_per_1k_tokens: 0.0065,
    context_window: 128000,
    latency: 760,
    documentation_url: "https://platform.openai.com/docs/models"
  },
  {
    id: "hf-mistral-7b-instruct",
    name: "Mistral 7B Instruct",
    provider: "HuggingFace",
    capabilities: ["chat", "summarization"],
    price_per_1k_tokens: 0.0011,
    context_window: 32000,
    latency: 690,
    documentation_url: "https://huggingface.co/models"
  },
  {
    id: "hf-codellama-34b",
    name: "CodeLlama 34B Instruct",
    provider: "HuggingFace",
    capabilities: ["code generation", "reasoning"],
    price_per_1k_tokens: 0.0028,
    context_window: 16384,
    latency: 880,
    documentation_url: "https://huggingface.co/models"
  },
  {
    id: "google-gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    capabilities: ["chat", "reasoning", "summarization", "code generation"],
    price_per_1k_tokens: 0.0048,
    context_window: 1000000,
    latency: 710,
    documentation_url: "https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference"
  },
  {
    id: "google-gemini-1-5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google",
    capabilities: ["chat", "summarization", "translation"],
    price_per_1k_tokens: 0.0022,
    context_window: 1000000,
    latency: 350,
    documentation_url: "https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference"
  },
  {
    id: "aws-claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "AWS",
    capabilities: ["chat", "summarization", "reasoning"],
    price_per_1k_tokens: 0.002,
    context_window: 200000,
    latency: 400,
    documentation_url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html"
  },
  {
    id: "aws-claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "AWS",
    capabilities: ["chat", "reasoning", "code generation", "summarization"],
    price_per_1k_tokens: 0.0042,
    context_window: 200000,
    latency: 520,
    documentation_url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html"
  },
  {
    id: "aws-llama-3-70b",
    name: "Llama 3 70B Instruct",
    provider: "AWS",
    capabilities: ["chat", "reasoning", "code generation"],
    price_per_1k_tokens: 0.0037,
    context_window: 128000,
    latency: 640,
    documentation_url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html"
  },
  {
    id: "azure-gpt-4o",
    name: "Azure OpenAI GPT-4o",
    provider: "Azure",
    capabilities: ["chat", "reasoning", "code generation", "summarization"],
    price_per_1k_tokens: 0.0052,
    context_window: 128000,
    latency: 590,
    documentation_url: "https://learn.microsoft.com/azure/ai-services/openai/concepts/models"
  },
  {
    id: "azure-gpt-4o-mini",
    name: "Azure OpenAI GPT-4o mini",
    provider: "Azure",
    capabilities: ["chat", "summarization", "code generation"],
    price_per_1k_tokens: 0.0019,
    context_window: 128000,
    latency: 470,
    documentation_url: "https://learn.microsoft.com/azure/ai-services/openai/concepts/models"
  }
];
