"use client";

import { FormEvent } from "react";
import { useModelStore } from "@/store/useModelStore";

export function SearchBar() {
  const query = useModelStore((s) => s.query);
  const setQuery = useModelStore((s) => s.setQuery);
  const runSearch = useModelStore((s) => s.runSearch);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await runSearch();
  };

  return (
    <form onSubmit={onSubmit} className="sticky top-0 z-20 rounded-xl border border-zinc-800 bg-zinc-950/95 p-4 backdrop-blur">
      <label htmlFor="query" className="mb-2 block text-sm font-medium text-zinc-200">
        Search by use case
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="query"
          className="input"
          placeholder='Try "customer support chatbot" or "coding assistant"'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-zinc-950 transition hover:bg-orange-400"
        >
          Search models
        </button>
      </div>
    </form>
  );
}
