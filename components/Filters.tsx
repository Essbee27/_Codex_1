"use client";

import { models } from "@/data/models";
import { Capability, Provider } from "@/types/model";
import { useModelStore } from "@/store/useModelStore";

const providers: Array<Provider | "All"> = ["All", ...new Set(models.map((m) => m.provider))];
const capabilities: Array<Capability | "All"> = [
  "All",
  ...new Set(models.flatMap((m) => m.capabilities))
] as Array<Capability | "All">;

const maxPrice = Math.ceil(Math.max(...models.map((m) => m.price_per_1k_tokens)) * 1000) / 1000;

export function Filters() {
  const providerFilter = useModelStore((s) => s.providerFilter);
  const capabilityFilter = useModelStore((s) => s.capabilityFilter);
  const selectedMaxPrice = useModelStore((s) => s.maxPrice);
  const sortBy = useModelStore((s) => s.sortBy);
  const setProviderFilter = useModelStore((s) => s.setProviderFilter);
  const setCapabilityFilter = useModelStore((s) => s.setCapabilityFilter);
  const setMaxPrice = useModelStore((s) => s.setMaxPrice);
  const setSortBy = useModelStore((s) => s.setSortBy);

  return (
    <section className="card grid gap-4 md:grid-cols-4">
      <div>
        <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">Provider</label>
        <select className="input" value={providerFilter} onChange={(e) => setProviderFilter(e.target.value as Provider | "All")}>
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
          Max price per 1k tokens: ${selectedMaxPrice.toFixed(3)}
        </label>
        <input
          className="w-full accent-orange-500"
          type="range"
          min={0.001}
          max={maxPrice}
          step={0.0001}
          value={selectedMaxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
      </div>
    </section>
  );
}
