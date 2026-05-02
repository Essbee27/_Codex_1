"use client";

import { useMemo } from "react";
import { Capability } from "@/types/model";
import { useModelStore } from "@/store/useModelStore";

export function Filters() {
  const ranked = useModelStore((s) => s.ranked);
  const providerFilter = useModelStore((s) => s.providerFilter);
  const capabilityFilter = useModelStore((s) => s.capabilityFilter);
  const selectedMaxPrice = useModelStore((s) => s.maxPrice);
  const sortBy = useModelStore((s) => s.sortBy);
  const setProviderFilter = useModelStore((s) => s.setProviderFilter);
  const setCapabilityFilter = useModelStore((s) => s.setCapabilityFilter);
  const setMaxPrice = useModelStore((s) => s.setMaxPrice);
  const setSortBy = useModelStore((s) => s.setSortBy);

  const providers = useMemo(() => ["All", ...new Set(ranked.map((m) => m.model.provider))], [ranked]);
  const capabilities = useMemo(
    () => ["All", ...new Set(ranked.flatMap((m) => m.model.capabilities))] as Array<Capability | "All">,
    [ranked]
  );

  const maxPrice = useMemo(
    () => Math.max(selectedMaxPrice, ...ranked.map((m) => m.model.price_per_1k_tokens), 0.02),
    [ranked, selectedMaxPrice]
  );

  return (
    <section className="card grid gap-4 md:grid-cols-4">
      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">Provider</label>
        <select className="input" value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}>
          {providers.map((provider) => (
            <option key={provider} value={provider}>
              {provider}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">Capability</label>
        <select
          className="input"
          value={capabilityFilter}
          onChange={(e) => setCapabilityFilter(e.target.value as Capability | "All")}
        >
          {capabilities.map((capability) => (
            <option key={capability} value={capability}>
              {capability}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">Sort</label>
        <select className="input" value={sortBy} onChange={(e) => setSortBy(e.target.value as "relevance" | "cost")}>
          <option value="relevance">Relevance</option>
          <option value="cost">Cost</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">
          Max price per 1k tokens: ${selectedMaxPrice.toFixed(4)}
        </label>
        <input
          className="w-full accent-orange-500"
          type="range"
          min={0.0005}
          max={maxPrice}
          step={0.0001}
          value={selectedMaxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>
    </section>
  );
}
