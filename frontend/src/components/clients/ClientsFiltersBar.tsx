import { Download, Search } from "lucide-react";
import { ClientStatus, SortBy, SortDir, Therapist, TherapyType } from "../../types/clientsDashboardTypes";
import { DropdownSelect } from "../custom-ui/dropdown";

interface ClientsFiltersBarProps {
  searchInput: string;
  statusFilter: "" | ClientStatus;
  therapistFilter: string;
  therapyTypeFilter: "" | TherapyType;
  sortBy: SortBy;
  sortDir: SortDir;
  therapists: Therapist[];
  onSearchInputChange: (value: string) => void;
  onStatusFilterChange: (value: "" | ClientStatus) => void;
  onTherapistFilterChange: (value: string) => void;
  onTherapyTypeFilterChange: (value: "" | TherapyType) => void;
  onSortChange: (sortBy: SortBy, sortDir: SortDir) => void;
  onClearFilters: () => void;
  onExportCsv: () => void;
}

export function ClientsFiltersBar({
  searchInput,
  statusFilter,
  therapistFilter,
  therapyTypeFilter,
  sortBy,
  sortDir,
  therapists,
  onSearchInputChange,
  onStatusFilterChange,
  onTherapistFilterChange,
  onTherapyTypeFilterChange,
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
          placeholder="Search by name, ID, phone..."
        />
      </label>

      <DropdownSelect
        triggerClassName={selectClassName}
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value as "" | ClientStatus)}
        options={[
          { value: "", label: "Status" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "new", label: "New" },
          { value: "discharged", label: "Discharged" },
          { value: "on_hold", label: "On Hold" },
        ]}
      />

      <DropdownSelect
        triggerClassName={selectClassName}
        value={therapistFilter}
        onChange={(event) => onTherapistFilterChange(event.target.value)}
        options={[{ value: "", label: "Therapist" }, ...therapists.map((therapist) => ({ value: therapist.id, label: therapist.name }))]}
      />

      <DropdownSelect
        triggerClassName={selectClassName}
        value={therapyTypeFilter}
        onChange={(event) => onTherapyTypeFilterChange(event.target.value as "" | TherapyType)}
        options={[
          { value: "", label: "Therapy Type" },
          { value: "individual", label: "Individual" },
          { value: "group", label: "Group" },
          { value: "online", label: "Online" },
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
          { value: "name:asc", label: "Sort: Name (A-Z)" },
          { value: "name:desc", label: "Sort: Name (Z-A)" },
          { value: "age:asc", label: "Sort: Age (Low to high)" },
          { value: "age:desc", label: "Sort: Age (High to low)" },
          { value: "lastSession:desc", label: "Sort: Last session (Newest)" },
          { value: "lastSession:asc", label: "Sort: Last session (Oldest)" },
          { value: "totalSessions:desc", label: "Sort: Total sessions (High to low)" },
          { value: "totalSessions:asc", label: "Sort: Total sessions (Low to high)" },
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
