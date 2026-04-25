import { FileDown } from "lucide-react";

export function AnalyticsPageHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-4xl font-bold text-[#1a1a2e]">Analytics</h1>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm text-slate-600"
        >
          Jan 2025 - Dec 2025
        </button>
        <button
          type="button"
          className="inline-flex h-9 items-center gap-2 rounded-lg border-0 bg-[var(--primary)] px-3 text-[13px] font-semibold text-white"
        >
          <FileDown size={15} />
          Export Report
        </button>
      </div>
    </header>
  );
}
