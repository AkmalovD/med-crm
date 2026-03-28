import { LayoutGrid, List } from "lucide-react";

import type { RoomsViewMode } from "@/types/roomsDashboardTypes";

import styles from "./RoomsDashboardPage.module.css";

interface RoomsViewToggleProps {
  viewMode: RoomsViewMode;
  onChange: (mode: RoomsViewMode) => void;
}

export function RoomsViewToggle({ viewMode, onChange }: RoomsViewToggleProps) {
  return (
    <div className={styles.viewToggle} role="group" aria-label="View mode">
      <button
        type="button"
        className={viewMode === "grid" ? styles.activeViewButton : undefined}
        onClick={() => onChange("grid")}
        aria-pressed={viewMode === "grid"}
        aria-label="Grid view"
      >
        <LayoutGrid size={16} />
      </button>
      <button
        type="button"
        className={viewMode === "list" ? styles.activeViewButton : undefined}
        onClick={() => onChange("list")}
        aria-pressed={viewMode === "list"}
        aria-label="List view"
      >
        <List size={16} />
      </button>
    </div>
  );
}
