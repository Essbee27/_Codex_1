import { ComparisonCards } from "@/components/ComparisonCards";
import { CostSimulator } from "@/components/CostSimulator";
import { Filters } from "@/components/Filters";
import { ResultsTable } from "@/components/ResultsTable";
import { SearchBar } from "@/components/SearchBar";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.24em] text-orange-400">LLM Model Intelligence</p>
        <h1 className="text-3xl font-bold text-zinc-50">Compare foundation models for your product use case</h1>
        <p className="max-w-3xl text-zinc-400">
          Frontend-only decision workspace with local relevance ranking, provider filters, and spend simulation.
        </p>
      </header>

      <SearchBar />
      <Filters />
      <ComparisonCards />
      <ResultsTable />
      <CostSimulator />
    </main>
  );
}
