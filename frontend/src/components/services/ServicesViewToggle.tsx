import { ServicesViewMode } from "@/types/servicesDashboardTypes";
import { cx } from "@/utils/servicesDashboardUtils";
import styles from "./ServicesDashboardPage.module.css";

interface ServicesViewToggleProps {
  viewMode: ServicesViewMode;
  onChange: (mode: ServicesViewMode) => void;
}

export function ServicesViewToggle({ viewMode, onChange }: ServicesViewToggleProps) {
  return (
    <div className={styles.viewToggle}>
      <button
        className={cx(viewMode === "grid" && styles.activeViewButton)}
        type="button"
        onClick={() => onChange("grid")}
      >
        Grid
      </button>
      <button
        className={cx(viewMode === "list" && styles.activeViewButton)}
        type="button"
        onClick={() => onChange("list")}
      >
        List
      </button>
    </div>
  );
}
