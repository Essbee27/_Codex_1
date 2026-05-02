"use client";

import { create } from "zustand";
import { Capability, RankedModel } from "@/types/model";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/v1";

type SortBy = "relevance" | "cost";

interface ModelState {
  query: string;
  providerFilter: string | "All";
  capabilityFilter: Capability | "All";
  maxPrice: number;
  monthlyTokens: number;
  sortBy: SortBy;
  loading: boolean;
  error: string | null;
  ranked: RankedModel[];
  setQuery: (query: string) => void;
  setProviderFilter: (provider: string | "All") => void;
  setCapabilityFilter: (capability: Capability | "All") => void;
  setMaxPrice: (price: number) => void;
  setMonthlyTokens: (tokens: number) => void;
  setSortBy: (sortBy: SortBy) => void;
  runSearch: () => Promise<void>;
  filteredModels: () => RankedModel[];
}

export const useModelStore = create<ModelState>((set, get) => ({
  query: "customer support",
  providerFilter: "All",
  capabilityFilter: "All",
  maxPrice: 0.02,
  monthlyTokens: 500000,
  sortBy: "relevance",
  loading: false,
  error: null,
  ranked: [],
  setQuery: (query) => set({ query }),
  setProviderFilter: (providerFilter) => set({ providerFilter }),
  setCapabilityFilter: (capabilityFilter) => set({ capabilityFilter }),
  setMaxPrice: (maxPrice) => set({ maxPrice }),
  setMonthlyTokens: (monthlyTokens) => set({ monthlyTokens }),
  setSortBy: (sortBy) => set({ sortBy }),
  runSearch: async () => {
    const { query } = get();
    set({ loading: true, error: null });

    try {
      const response = await fetch(`${API_BASE}/models/search?query=${encodeURIComponent(query)}`);
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload?.error?.message || "Failed to fetch ranked models");
      }

      const ranked: RankedModel[] = payload.data;
      const maxPrice = Math.max(...ranked.map((entry) => entry.model.price_per_1k_tokens), 0.02);

      set({ ranked, maxPrice, loading: false });
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Unexpected error while searching models"
      });
    }
  },
  filteredModels: () => {
    const { ranked, providerFilter, capabilityFilter, maxPrice, sortBy } = get();

    const filtered = ranked.filter(({ model }) => {
      const providerMatch = providerFilter === "All" || model.provider === providerFilter;
      const capabilityMatch = capabilityFilter === "All" || model.capabilities.includes(capabilityFilter);
      const priceMatch = model.price_per_1k_tokens <= maxPrice;
      return providerMatch && capabilityMatch && priceMatch;
    });

    if (sortBy === "cost") {
      return [...filtered].sort((a, b) => a.model.price_per_1k_tokens - b.model.price_per_1k_tokens);
    }

    return [...filtered].sort((a, b) => b.score - a.score);
  }
}));
