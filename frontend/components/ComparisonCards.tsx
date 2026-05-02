"use client";

import { useModelStore } from "@/store/useModelStore";

export function ComparisonCards() {
  const models = useModelStore((s) => s.filteredModels());

  const topModels = models.slice(0, 3);

  if (!topModels.length) return null;

  return (
    <section className="grid gap-4 lg:grid-cols-3">
      {topModels.map(({ model, score, explanation, strengths }) => (
        <article key={model.id} className="card border-orange-500/20 shadow-glow">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-semibold text-zinc-100">{model.name}</h3>
            <span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{model.provider}</span>
          </div>
          <p className="mb-2 text-xs text-zinc-500">Score: {score.toFixed(3)}</p>
          <p className="mb-3 text-sm text-zinc-300">{explanation}</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {strengths.map((badge) => (
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
      ))}
    </section>
  );
}
