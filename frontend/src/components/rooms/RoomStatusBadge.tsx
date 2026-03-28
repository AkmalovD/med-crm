import type { RoomStatus } from "@/types/roomsDashboardTypes";

import styles from "./RoomsDashboardPage.module.css";

const STATUS_CLASS: Record<RoomStatus, string> = {
  available: styles.statusAvailable,
  occupied: styles.statusOccupied,
  maintenance: styles.statusMaintenance,
};

const STATUS_LABEL: Record<RoomStatus, string> = {
  available: "Available",
  occupied: "Occupied",
  maintenance: "Maintenance",
};

export function RoomStatusBadge({ status }: { status: RoomStatus }) {
  return (
    <span className={`${styles.statusBadge} ${STATUS_CLASS[status]}`}>
      <span aria-hidden>●</span>
      {STATUS_LABEL[status]}
    </span>
  );
}
