import { LlmModel } from "@/types/model";

export const models: LlmModel[] = [
  {
    id: "openai-gpt-4o-mini",
    name: "GPT-4o mini",
    provider: "OpenAI",
    capabilities: ["chat", "summarization", "code generation", "reasoning"],
    price_per_1k_tokens: 0.003,
    context_window: 128000,
    latency: 520,
    description: "Efficient multimodal-capable model with strong chat and coding performance.",
    documentation_url: "https://platform.openai.com/docs/models"
  },
  {
    id: "hf-zephyr-7b-beta",
    name: "Zephyr 7B Beta",
    provider: "Hugging Face",
    capabilities: ["chat", "summarization"],
    price_per_1k_tokens: 0.0018,
    context_window: 32000,
    latency: 680,
    description: "Community fine-tuned conversational model optimized for assistant-style responses.",
    documentation_url: "https://huggingface.co/models"
  },
  {
    id: "vertex-gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google Vertex AI",
    capabilities: ["chat", "reasoning", "code generation", "summarization", "multimodal"],
    price_per_1k_tokens: 0.0045,
    context_window: 1000000,
    latency: 730,
    description: "Long-context enterprise model suited for deep analysis and reasoning-heavy workflows.",
    documentation_url: "https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference"
  },
  {
    id: "bedrock-claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Amazon Bedrock",
    capabilities: ["chat", "summarization", "reasoning"],
    price_per_1k_tokens: 0.002,
    context_window: 200000,
    latency: 410,
    description: "Low-latency Bedrock model for responsive assistants and summarization at scale.",
    documentation_url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html"
  },
  {
    id: "azure-gpt-4o",
    name: "Azure OpenAI GPT-4o",
    provider: "Azure OpenAI",
    capabilities: ["chat", "code generation", "reasoning", "summarization"],
    price_per_1k_tokens: 0.005,
    context_window: 128000,
    latency: 580,
    description: "Enterprise-grade deployment of advanced GPT family model in Azure environments.",
    documentation_url: "https://learn.microsoft.com/azure/ai-services/openai/concepts/models"
  },
  {
    id: "openai-gpt-4-1",
    name: "GPT-4.1",
    provider: "OpenAI",
    capabilities: ["chat", "code generation", "reasoning", "agents"],
    price_per_1k_tokens: 0.006,
    context_window: 128000,
    latency: 760,
    description: "High-fidelity model for complex coding and multi-step agentic orchestration.",
    documentation_url: "https://platform.openai.com/docs/models"
  },
  {
    id: "vertex-gemini-1-5-flash",
    name: "Gemini 1.5 Flash",
    provider: "Google Vertex AI",
    capabilities: ["chat", "summarization", "translation"],
    price_per_1k_tokens: 0.0025,
    context_window: 1000000,
    latency: 360,
    description: "Fast and cost-effective model for high-throughput chat and summarization tasks.",
    documentation_url: "https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference"
  },
  {
    id: "bedrock-llama-3-70b",
    name: "Llama 3 70B Instruct",
    provider: "Amazon Bedrock",
    capabilities: ["chat", "code generation", "reasoning"],
    price_per_1k_tokens: 0.0039,
    context_window: 128000,
    latency: 640,
    description: "Large open-weight style instruction-tuned model available through Bedrock.",
    documentation_url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html"
  }
];
