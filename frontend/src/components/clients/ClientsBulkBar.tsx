interface ClientsBulkBarProps {
  selectedCount: string;
  onBulkExport: () => void;
}

export function ClientsBulkBar({ selectedCount, onBulkExport }: ClientsBulkBarProps) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-[10px] rounded-xl border border-[#d6e6f6] bg-[#f7fbff] px-3 py-[10px]">
      <p className="text-sm font-medium text-slate-700">{selectedCount} selected</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-[34px] rounded-lg border border-(--border) bg-white px-[11px] text-[13px] font-semibold text-slate-700"
          onClick={onBulkExport}
        >
          Bulk Export
        </button>
      </div>
    </section>
  );
}
