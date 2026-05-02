import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const models = [
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
    id: "claude-3-haiku",
    name: "Claude 3 Haiku",
    provider: "Amazon Bedrock",
    capabilities: ["chat", "summarization", "reasoning"],
    price_per_1k_tokens: 0.002,
    context_window: 200000,
    latency: 410,
    documentation_url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html"
  },
  {
    id: "gemini-1-5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google Vertex AI",
    capabilities: ["chat", "reasoning", "code generation", "summarization"],
    price_per_1k_tokens: 0.0045,
    context_window: 1000000,
    latency: 730,
    documentation_url: "https://cloud.google.com/vertex-ai/docs/generative-ai/model-reference"
  }
];

async function seed() {
  const { error } = await supabase.from("models").upsert(models, { onConflict: "id" });

  if (error) {
    throw error;
  }

  console.log("Seed complete.");
}

seed().catch((error) => {
  console.error("Seed failed.", error.message);
  process.exit(1);
});
