import { X } from "lucide-react";

import type { RoomFilters } from "@/types/roomsDashboardTypes";

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
      <select
        className={styles.selectInput}
        value={typeFilter}
        onChange={(e) => onTypeChange(e.target.value as RoomFilters["type"])}
        aria-label="Filter by room type"
      >
        <option value="">All types</option>
        <option value="individual">Individual</option>
        <option value="group">Group</option>
        <option value="assessment">Assessment</option>
        <option value="waiting">Waiting area</option>
        <option value="other">Other</option>
      </select>
      <select
        className={styles.selectInput}
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as RoomFilters["status"])}
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
        <option value="maintenance">Maintenance</option>
      </select>
      <button className={styles.ghostButton} type="button" onClick={onClear}>
        <X size={16} aria-hidden />
        Clear
      </button>
    </div>
  );
}
