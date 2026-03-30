import { X } from "lucide-react";

import type { RoomFilters } from "@/types/roomsDashboardTypes";
import { DropdownSelect } from "../custom-ui/dropdown";

import styles from "./RoomsDashboardPage.module.css";

interface RoomsFilterBarProps {
  searchInput: string;
  typeFilter: RoomFilters["type"];
  statusFilter: RoomFilters["status"];
  onSearchInputChange: (value: string) => void;
  onTypeChange: (value: RoomFilters["type"]) => void;
  onStatusChange: (value: RoomFilters["status"]) => void;
  onClear: () => void;
}

export function RoomsFilterBar({
  searchInput,
  typeFilter,
  statusFilter,
  onSearchInputChange,
  onTypeChange,
  onStatusChange,
  onClear,
}: RoomsFilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <input
        className={styles.searchInput}
        placeholder="Search rooms..."
        value={searchInput}
        onChange={(e) => onSearchInputChange(e.target.value)}
        aria-label="Search rooms"
      />
      <DropdownSelect
        triggerClassName={styles.selectInput}
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as RoomFilters["type"])}
        aria-label="Filter by room type"
        options={[
          { value: "", label: "All types" },
          { value: "individual", label: "Individual" },
          { value: "group", label: "Group" },
          { value: "assessment", label: "Assessment" },
          { value: "waiting", label: "Waiting area" },
          { value: "other", label: "Other" },
        ]}
      />
      <DropdownSelect
        triggerClassName={styles.selectInput}
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as RoomFilters["status"])}
        aria-label="Filter by status"
        options={[
          { value: "", label: "All statuses" },
          { value: "available", label: "Available" },
          { value: "occupied", label: "Occupied" },
          { value: "maintenance", label: "Maintenance" },
        ]}
      />
      <button className={styles.ghostButton} type="button" onClick={onClear}>
        <X size={16} aria-hidden />
        Clear
      </button>
    </div>
  );
}
