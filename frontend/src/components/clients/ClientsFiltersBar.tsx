import { Download, Search } from "lucide-react";
import { ClientStatus, SortBy, SortDir } from "../../types/clientsDashboardTypes";
import { DropdownSelect } from "../custom-ui/dropdown";

interface ClientsFiltersBarProps {
  searchInput: string;
  statusFilter: "" | ClientStatus;
  sortBy: SortBy;
  sortDir: SortDir;
  onSearchInputChange: (value: string) => void;
  onStatusFilterChange: (value: "" | ClientStatus) => void;
  onSortChange: (sortBy: SortBy, sortDir: SortDir) => void;
  onClearFilters: () => void;
  onExportCsv: () => void;
}

export function ClientsFiltersBar({
  searchInput,
  statusFilter,
  sortBy,
  sortDir,
  onSearchInputChange,
  onStatusFilterChange,
  onSortChange,
  onClearFilters,
  onExportCsv,
}: ClientsFiltersBarProps) {
  const selectClassName =
    "h-9 rounded-lg border border-(--border) bg-white px-[10px] text-[13px] text-slate-600";

  return (
    <section className="flex flex-wrap items-center gap-2 rounded-xl border border-(--border) bg-white p-3">
      <label className="inline-flex h-9 min-w-[260px] flex-1 items-center gap-[6px] rounded-lg border border-(--border) bg-white px-[10px] max-[1080px]:min-w-[220px]">
        <Search size={15} className="text-slate-400" />
        <input
          className="w-full border-0 bg-transparent text-[13px] text-slate-700 outline-none"
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder="Search by name, email, phone, organization…"
        />
      </label>

      <DropdownSelect
        triggerClassName={selectClassName}
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value as "" | ClientStatus)}
        options={[
          { value: "", label: "All Statuses" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />

      <DropdownSelect
        triggerClassName={selectClassName}
        value={`${sortBy}:${sortDir}`}
        onChange={(event) => {
          const [nextSortBy, nextSortDir] = event.target.value.split(":") as [SortBy, SortDir];
          onSortChange(nextSortBy, nextSortDir);
        }}
        options={[
          { value: "name:asc", label: "Sort: Name (A–Z)" },
          { value: "name:desc", label: "Sort: Name (Z–A)" },
          { value: "createdAt:desc", label: "Sort: Newest first" },
          { value: "createdAt:asc", label: "Sort: Oldest first" },
        ]}
      />

      <button
        type="button"
        className="h-9 rounded-lg border border-(--border) bg-white px-3 text-[13px] font-semibold text-slate-500"
        onClick={onClearFilters}
      >
        Clear Filters
      </button>

      <button
        type="button"
        className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#ccf3dd] bg-[#edfaf3] px-3 text-[13px] font-semibold text-[#0f5132]"
        onClick={onExportCsv}
      >
        <Download size={14} />
        Export CSV
      </button>
    </section>
  );
}
