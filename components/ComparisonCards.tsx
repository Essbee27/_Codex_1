"use client";

import { useMemo } from "react";
import { filterAndSortModels } from "@/lib/modelSelectors";
import { useModelStore } from "@/store/useModelStore";

export function ComparisonCards() {
  const scored = useModelStore((s) => s.scored);
  const providerFilter = useModelStore((s) => s.providerFilter);
  const capabilityFilter = useModelStore((s) => s.capabilityFilter);
  const maxPrice = useModelStore((s) => s.maxPrice);
  const sortBy = useModelStore((s) => s.sortBy);

  const topModels = useMemo(() => {
    const rows = filterAndSortModels(scored, providerFilter, capabilityFilter, maxPrice, sortBy);
    return rows.slice(0, 3);
  }, [scored, providerFilter, capabilityFilter, maxPrice, sortBy]);

  if (!topModels.length) return null;

  const cheapestId = [...topModels].sort((a, b) => a.model.price_per_1k_tokens - b.model.price_per_1k_tokens)[0].model.id;
  const fastestId = [...topModels].sort((a, b) => a.model.latency - b.model.latency)[0].model.id;
  const bestMatchId = topModels[0].model.id;

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {topModels.map(({ model, relevanceScore }) => {
        const badges: string[] = [];
        if (model.id === bestMatchId) badges.push("Best match");
        if (model.id === cheapestId) badges.push("Cheapest");
        if (model.id === fastestId) badges.push("Fastest");

        return (
          <article key={model.id} className="card border-orange-500/20 shadow-glow">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="font-semibold text-zinc-100">{model.name}</h3>
              <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{model.provider}</span>
            </div>
            <p className="mb-3 text-sm text-zinc-300">{model.description}</p>
            <p className="mb-3 text-xs text-zinc-500">Relevance score: {relevanceScore.toFixed(2)}</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span key={badge} className="rounded-full bg-orange-500/20 px-2 py-1 text-xs text-orange-300">
                  {badge}
                </span>
              ))}
            </div>
            <a
              href={model.documentation_url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-orange-400 hover:text-orange-300"
            >
              View documentation →
            </a>
          </article>
        );
      })}
    </section>
  );
}
