"use client";

import { useEffect, useState } from "react";
import { useModelStore } from "@/store/useModelStore";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/v1";

export function CostSimulator() {
  const monthlyTokens = useModelStore((s) => s.monthlyTokens);
  const setMonthlyTokens = useModelStore((s) => s.setMonthlyTokens);
  const models = useModelStore((s) => s.filteredModels());
  const [estimates, setEstimates] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEstimates() {
      setError(null);
      try {
        const pairs = await Promise.all(
          models.map(async ({ model }) => {
            const response = await fetch(`${API_BASE}/cost/estimate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ model_id: model.id, monthly_tokens: monthlyTokens })
            });
            const payload = await response.json();
            if (!response.ok || !payload.success) {
              throw new Error(payload?.error?.message || `Failed estimating cost for ${model.name}`);
            }
            return [model.id, payload.data.estimated_cost as number] as const;
          })
        );

        if (!cancelled) {
          setEstimates(Object.fromEntries(pairs));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to estimate costs");
        }
      }
    }

    if (models.length) {
      void loadEstimates();
    } else {
      setEstimates({});
    }

    return () => {
      cancelled = true;
    };
  }, [models, monthlyTokens]);

  return (
    <section className="card space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Cost simulator</h2>
          <p className="text-sm text-zinc-400">Estimate monthly spend from backend pricing.</p>
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

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="grid gap-2">
        {models.map(({ model }) => (
          <div key={model.id} className="flex items-center justify-between rounded-lg bg-zinc-800/60 px-3 py-2 text-sm">
            <span>
              {model.name} <span className="text-zinc-400">({model.provider})</span>
            </span>
            <span className="font-semibold text-orange-300">
              {estimates[model.id] !== undefined ? `$${estimates[model.id].toFixed(2)}/month` : "Calculating..."}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
