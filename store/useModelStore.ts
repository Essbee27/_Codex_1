"use client";

import { create } from "zustand";
import { models } from "@/data/models";
import { Capability, LlmModel, Provider } from "@/types/model";
import { scoreModels } from "@/lib/relevance";

type SortBy = "relevance" | "cost";

interface ModelState {
  query: string;
  providerFilter: Provider | "All";
  capabilityFilter: Capability | "All";
  maxPrice: number;
  monthlyTokens: number;
  sortBy: SortBy;
  loading: boolean;
  scored: ReturnType<typeof scoreModels>;
  setQuery: (query: string) => void;
  setProviderFilter: (provider: Provider | "All") => void;
  setCapabilityFilter: (capability: Capability | "All") => void;
  setMaxPrice: (price: number) => void;
  setMonthlyTokens: (tokens: number) => void;
  setSortBy: (sortBy: SortBy) => void;
  runSearch: () => Promise<void>;
  filteredModels: () => Array<{ model: LlmModel; relevanceScore: number }>;
}

export const useModelStore = create<ModelState>((set, get) => ({
  query: "",
  providerFilter: "All",
  capabilityFilter: "All",
  maxPrice: Math.ceil(Math.max(...models.map((m) => m.price_per_1k_tokens)) * 1000) / 1000,
  monthlyTokens: 500000,
  sortBy: "relevance",
  loading: false,
  scored: scoreModels(""),
  setQuery: (query) => set({ query }),
  setProviderFilter: (providerFilter) => set({ providerFilter }),
  setCapabilityFilter: (capabilityFilter) => set({ capabilityFilter }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setMonthlyTokens: (monthlyTokens) => set({ monthlyTokens }),
  setSortBy: (sortBy) => set({ sortBy }),
  runSearch: async () => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set((state) => ({ loading: false, scored: scoreModels(state.query) }));
  },
  filteredModels: () => {
    const { scored, providerFilter, capabilityFilter, maxPrice, sortBy } = get();

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
}));
