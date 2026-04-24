"use client";

import { useModelStore } from "@/store/useModelStore";

export function ResultsTable() {
  const loading = useModelStore((s) => s.loading);
  const rows = useModelStore((s) => s.filteredModels());

  if (loading) {
    return (
      <section className="card">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} className="h-12 animate-pulse rounded-lg bg-zinc-800/80" />
          ))}
        </div>
      </section>
    );
  }

  if (!rows.length) {
    return (
      <section className="card py-12 text-center text-zinc-400">
        No models matched your filters. Try widening provider, capability, or price settings.
      </section>
    );
  }

  return (
    <section className="card overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-wide text-zinc-400">
          <tr>
            <th className="pb-3">Model</th>
            <th className="pb-3">Provider</th>
            <th className="pb-3">Capabilities</th>
            <th className="pb-3">Price / 1k</th>
            <th className="pb-3">Context</th>
            <th className="pb-3">Latency</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {rows.map(({ model }) => (
            <tr key={model.id}>
              <td className="py-4 font-medium text-zinc-100">{model.name}</td>
              <td className="py-4 text-zinc-300">{model.provider}</td>
              <td className="py-4 text-zinc-300">{model.capabilities.join(", ")}</td>
              <td className="py-4 text-orange-400">${model.price_per_1k_tokens.toFixed(4)}</td>
              <td className="py-4 text-zinc-300">{model.context_window.toLocaleString()}</td>
              <td className="py-4 text-zinc-300">{model.latency} ms</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
