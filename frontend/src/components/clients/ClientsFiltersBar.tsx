import { Download, Search } from "lucide-react";
import styles from "./ClientsDashboardPage.module.css";
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
  return (
    <section className={styles.filterBar}>
      <label className={styles.searchInput}>
        <Search size={15} className="text-slate-400" />
        <input
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder="Search by name, ID, phone..."
        />
      </label>

      <DropdownSelect
        triggerClassName={styles.select}
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
        triggerClassName={styles.select}
        value={therapistFilter}
        onChange={(event) => onTherapistFilterChange(event.target.value)}
        options={[{ value: "", label: "Therapist" }, ...therapists.map((therapist) => ({ value: therapist.id, label: therapist.name }))]}
      />

      <DropdownSelect
        triggerClassName={styles.select}
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
        triggerClassName={styles.select}
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

      <button type="button" className={styles.ghostButton} onClick={onClearFilters}>
        Clear Filters
      </button>

      <button type="button" className={styles.exportButton} onClick={onExportCsv}>
        <Download size={14} />
        Export CSV
      </button>
    </section>
  );
}
