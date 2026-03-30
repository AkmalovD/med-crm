import { Download, Search, X } from "lucide-react";
import styles from "./TherapistsDashboardPage.module.css";
import { EmploymentType, Specialization, TherapistStatus, TherapistSortBy, SortDir } from "@/types/therapistsDashboardTypes";
import { SPECIALIZATION_LABELS } from "@/data/therapistsData/therapistsDashboardData";
import { DropdownSelect } from "../custom-ui/dropdown";

interface TherapistsFiltersBarProps {
  searchInput: string;
  statusFilter: "" | TherapistStatus;
  employmentFilter: "" | EmploymentType;
  specializationFilter: "" | Specialization;
  sortBy: TherapistSortBy;
  sortDir: SortDir;
  onSearchInputChange: (value: string) => void;
  onStatusFilterChange: (value: "" | TherapistStatus) => void;
  onEmploymentFilterChange: (value: "" | EmploymentType) => void;
  onSpecializationFilterChange: (value: "" | Specialization) => void;
  onSortChange: (sortBy: TherapistSortBy, sortDir: SortDir) => void;
  onClearFilters: () => void;
  onExportCsv: () => void;
}

export function TherapistsFiltersBar({
  searchInput,
  statusFilter,
  employmentFilter,
  specializationFilter,
  sortBy,
  sortDir,
  onSearchInputChange,
  onStatusFilterChange,
  onEmploymentFilterChange,
  onSpecializationFilterChange,
  onSortChange,
  onClearFilters,
  onExportCsv,
}: TherapistsFiltersBarProps) {
  return (
    <section className={styles.filterBar}>
      <label className={styles.searchInput}>
        <Search size={15} className="text-slate-400" />
        <input
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          placeholder="Search by name or email..."
        />
      </label>

      <DropdownSelect
        triggerClassName={styles.select}
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value as "" | TherapistStatus)}
        options={[
          { value: "", label: "All Statuses" },
          { value: "active", label: "Active" },
          { value: "on_leave", label: "On Leave" },
          { value: "inactive", label: "Inactive" },
        ]}
      />

      <DropdownSelect
        triggerClassName={styles.select}
        value={employmentFilter}
        onChange={(event) => onEmploymentFilterChange(event.target.value as "" | EmploymentType)}
        options={[
          { value: "", label: "Employment Type" },
          { value: "full_time", label: "Full-time" },
          { value: "part_time", label: "Part-time" },
          { value: "contractor", label: "Contractor" },
        ]}
      />

      <DropdownSelect
        triggerClassName={styles.select}
        value={specializationFilter}
        onChange={(event) => onSpecializationFilterChange(event.target.value as "" | Specialization)}
        options={[
          { value: "", label: "Specialization" },
          ...Object.entries(SPECIALIZATION_LABELS).map(([value, label]) => ({ value, label })),
        ]}
      />

      <DropdownSelect
        triggerClassName={styles.select}
        value={`${sortBy}:${sortDir}`}
        onChange={(event) => {
          const [nextSortBy, nextSortDir] = event.target.value.split(":") as [TherapistSortBy, SortDir];
          onSortChange(nextSortBy, nextSortDir);
        }}
        options={[
          { value: "name:asc", label: "Sort: Name (A-Z)" },
          { value: "name:desc", label: "Sort: Name (Z-A)" },
          { value: "joinDate:desc", label: "Sort: Join date (Newest)" },
          { value: "joinDate:asc", label: "Sort: Join date (Oldest)" },
          { value: "clientCount:desc", label: "Sort: Clients (High to low)" },
          { value: "clientCount:asc", label: "Sort: Clients (Low to high)" },
          { value: "lastLogin:desc", label: "Sort: Last login (Newest)" },
          { value: "lastLogin:asc", label: "Sort: Last login (Oldest)" },
        ]}
      />

      <button type="button" className={styles.ghostButton} onClick={onClearFilters}>
        <X size={14} />
        Clear
      </button>

      <button type="button" className={styles.exportButton} onClick={onExportCsv}>
        <Download size={14} />
        Export CSV
      </button>
    </section>
  );
}

