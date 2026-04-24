"use client";

import { useModelStore } from "@/store/useModelStore";

export function CostSimulator() {
  const monthlyTokens = useModelStore((s) => s.monthlyTokens);
  const setMonthlyTokens = useModelStore((s) => s.setMonthlyTokens);
  const models = useModelStore((s) => s.filteredModels());

  return (
    <section className="card space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Cost simulator</h2>
          <p className="text-sm text-zinc-400">Estimate monthly spend from token usage using mock pricing.</p>
        </div>
        <div className="w-full sm:w-64">
          <label className="mb-2 block text-xs uppercase tracking-wide text-zinc-400">Monthly tokens</label>
          <input
            className="input"
            type="number"
            min={1000}
            value={monthlyTokens}
            onChange={(e) => setMonthlyTokens(Number(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        {models.map(({ model }) => {
          const estimate = (monthlyTokens / 1000) * model.price_per_1k_tokens;
          return (
            <div key={model.id} className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-3 py-2 text-sm">
              <span>
                {model.name} <span className="text-zinc-400">({model.provider})</span>
              </span>
              <span className="font-semibold text-orange-300">${estimate.toFixed(2)}/month</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
