import type { Room } from "@/types/roomsDashboardTypes";

import { RoomCard } from "./RoomCard";
import styles from "./RoomsDashboardPage.module.css";

interface RoomsGridProps {
  rooms: Room[];
  onDeleteRequest: (room: Room) => void;
  onClearMaintenance: (roomId: string) => void;
}

export function RoomsGrid({ rooms, onDeleteRequest, onClearMaintenance }: RoomsGridProps) {
  if (rooms.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid}>
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onDeleteRequest={onDeleteRequest} onClearMaintenance={onClearMaintenance} />
      ))}
    </div>
  );
}
