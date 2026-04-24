import { models } from "@/data/models";
import { Capability, ScoredModel } from "@/types/model";

const keywordRules: Array<{ pattern: RegExp; required: Capability[]; bonus?: string[] }> = [
  { pattern: /(customer support|help desk|support chatbot)/i, required: ["chat"], bonus: ["low-latency"] },
  { pattern: /(coding|developer|code|copilot)/i, required: ["code generation"] },
  { pattern: /(analysis|analytics|research|reasoning)/i, required: ["reasoning"] },
  { pattern: /(summary|summarize|brief)/i, required: ["summarization"] }
];

const normalizeLatency = (latency: number) => Math.max(0, 1 - latency / 1200);

export function scoreModels(useCase: string): ScoredModel[] {
  const hasQuery = useCase.trim().length > 0;

  const scored = models.map((model) => {
    if (!hasQuery) {
      return { model, relevanceScore: 0.5 + normalizeLatency(model.latency) * 0.25 };
    }

    const tokens = useCase.toLowerCase();
    let score = 0;

    keywordRules.forEach((rule) => {
      if (rule.pattern.test(tokens)) {
        const matchedCapabilities = rule.required.filter((requiredCapability) =>
          model.capabilities.includes(requiredCapability)
        ).length;

        score += matchedCapabilities * 2.5;

        if (rule.bonus?.includes("low-latency") && model.latency <= 500) {
          score += 1.8;
        }
      }
    });

    if (tokens.includes(model.provider.toLowerCase())) {
      score += 1;
    }

    if (tokens.includes("cheap") || tokens.includes("low cost") || tokens.includes("budget")) {
      score += Math.max(0, 2 - model.price_per_1k_tokens * 180);
    }

    score += normalizeLatency(model.latency) * 0.8;

    return { model, relevanceScore: score };
  });

  return scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
}
