import { Plus } from "lucide-react";

import styles from "./RoomsDashboardPage.module.css";

interface RoomsPageHeaderProps {
  totalRooms: number;
  onAddRoom: () => void;
}

export function RoomsPageHeader({ totalRooms, onAddRoom }: RoomsPageHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Rooms</h1>
        <p className={styles.subtle}>Create and manage physical therapy rooms, capacity, and availability.</p>
      </div>
      <div className={styles.actionsRow}>
        <span className={styles.badge}>{totalRooms} rooms</span>
        <button className={styles.primaryButton} type="button" onClick={onAddRoom}>
          <Plus size={16} aria-hidden />
          Add Room
        </button>
      </div>
    </header>
  );
}
