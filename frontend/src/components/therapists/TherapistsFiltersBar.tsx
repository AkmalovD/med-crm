import { Download, Search, X } from "lucide-react";
import styles from "./TherapistsDashboardPage.module.css";
import { EmploymentType, Specialization, TherapistStatus, TherapistSortBy, SortDir } from "@/types/therapistsDashboardTypes";
import { SPECIALIZATION_LABELS } from "@/data/therapistsData/therapistsDashboardData";

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

      <select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value as "" | TherapistStatus)}
        className={styles.select}
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="on_leave">On Leave</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        value={employmentFilter}
        onChange={(event) => onEmploymentFilterChange(event.target.value as "" | EmploymentType)}
        className={styles.select}
      >
        <option value="">Employment Type</option>
        <option value="full_time">Full-time</option>
        <option value="part_time">Part-time</option>
        <option value="contractor">Contractor</option>
      </select>

      <select
        value={specializationFilter}
        onChange={(event) => onSpecializationFilterChange(event.target.value as "" | Specialization)}
        className={styles.select}
      >
        <option value="">Specialization</option>
        {Object.entries(SPECIALIZATION_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={`${sortBy}:${sortDir}`}
        onChange={(event) => {
          const [nextSortBy, nextSortDir] = event.target.value.split(":") as [TherapistSortBy, SortDir];
          onSortChange(nextSortBy, nextSortDir);
        }}
      >
        <option value="name:asc">Sort: Name (A-Z)</option>
        <option value="name:desc">Sort: Name (Z-A)</option>
        <option value="joinDate:desc">Sort: Join date (Newest)</option>
        <option value="joinDate:asc">Sort: Join date (Oldest)</option>
        <option value="clientCount:desc">Sort: Clients (High to low)</option>
        <option value="clientCount:asc">Sort: Clients (Low to high)</option>
        <option value="lastLogin:desc">Sort: Last login (Newest)</option>
        <option value="lastLogin:asc">Sort: Last login (Oldest)</option>
      </select>

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

