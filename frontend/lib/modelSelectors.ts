import { LlmModel, ScoredModel } from "@/types/model";

export type SortBy = "relevance" | "cost";

export function filterAndSortModels(
  scored: ScoredModel[],
  providerFilter: LlmModel["provider"] | "All",
  capabilityFilter: LlmModel["capabilities"][number] | "All",
  maxPrice: number,
  sortBy: SortBy
): ScoredModel[] {
  const filtered = scored.filter(({ model }) => {
    const providerMatch = providerFilter === "All" || model.provider === providerFilter;
    const capabilityMatch = capabilityFilter === "All" || model.capabilities.includes(capabilityFilter);
    const priceMatch = model.price_per_1k_tokens <= maxPrice;
    return providerMatch && capabilityMatch && priceMatch;
  });

  if (sortBy === "cost") {
    return [...filtered].sort((a, b) => a.model.price_per_1k_tokens - b.model.price_per_1k_tokens);
  }

  return [...filtered].sort((a, b) => b.relevanceScore - a.relevanceScore);
}
