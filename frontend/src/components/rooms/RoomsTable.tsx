"use client";

import { useState, useRef, useEffect } from "react";
import { Eye, MoreHorizontal, Pencil } from "lucide-react";

import { ROOM_AMENITY_LABELS, ROOM_TYPE_LABELS } from "@/data/roomsData/roomsDashboardData";
import { useRoomStore } from "@/store/useRoomStore";
import type { Room, RoomAmenity, RoomSortBy, SortDir } from "@/types/roomsDashboardTypes";

import { RoomStatusBadge } from "./RoomStatusBadge";
import styles from "./RoomsDashboardPage.module.css";

const AMENITY_ICONS: Record<RoomAmenity, string> = {
  projector: "🖥",
  whiteboard: "📋",
  mirror: "✨",
  computer: "💻",
  therapy_equipment: "⚕",
  audio_system: "🔊",
  natural_light: "☀",
  wheelchair_accessible: "♿",
  sink: "💧",
  storage: "📦",
};

interface RoomsTableProps {
  rooms: Room[];
  sortBy: RoomSortBy;
  sortDir: SortDir;
  onSortChange: (sortBy: RoomSortBy, sortDir: SortDir) => void;
  onDeleteRequest: (room: Room) => void;
  onClearMaintenance: (roomId: string) => void;
}

function SortIndicator({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <span className={styles.sortHint}></span>;
  return <span className={styles.sortHint}>{dir === "asc" ? "↑" : "↓"}</span>;
}

function RowMenu({
  room,
  onDeleteRequest,
  onClearMaintenance,
}: {
  room: Room;
  onDeleteRequest: (room: Room) => void;
  onClearMaintenance: (roomId: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const toggleSchedulePanel = useRoomStore((s) => s.toggleSchedulePanel);
  const openEditModal = useRoomStore((s) => s.openEditModal);
  const openMaintenanceModal = useRoomStore((s) => s.openMaintenanceModal);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className={styles.dropdownWrap} ref={ref}>
      <button type="button" className={styles.menuButton} onClick={() => setOpen((o) => !o)} aria-label="More actions">
        <MoreHorizontal size={16} />
      </button>
      {open ? (
        <div className={styles.dropdownMenu}>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openMaintenanceModal(room.id);
            }}
          >
            Set maintenance
          </button>
          {room.status === "maintenance" ? (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onClearMaintenance(room.id);
              }}
            >
              Clear maintenance
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDeleteRequest(room);
            }}
          >
            Delete
          </button>
        </div>
      ) : null}
    </div>
  );
}

export function RoomsTable({
  rooms,
  sortBy,
  sortDir,
  onSortChange,
  onDeleteRequest,
  onClearMaintenance,
}: RoomsTableProps) {
  const toggleSchedulePanel = useRoomStore((s) => s.toggleSchedulePanel);
  const openEditModal = useRoomStore((s) => s.openEditModal);

  const cycleSort = (column: RoomSortBy) => {
    if (sortBy !== column) onSortChange(column, "asc");
    else onSortChange(column, sortDir === "asc" ? "desc" : "asc");
  };

  if (rooms.length === 0) {
    return null;
  }

  return (
    <section className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th onClick={() => cycleSort("name")} scope="col">
              Room
              <SortIndicator active={sortBy === "name"} dir={sortDir} />
            </th>
            <th scope="col">Type</th>
            <th onClick={() => cycleSort("capacity")} scope="col">
              Capacity
              <SortIndicator active={sortBy === "capacity"} dir={sortDir} />
            </th>
            <th scope="col">Amenities</th>
            <th scope="col">Hours</th>
            <th scope="col">Today</th>
            <th onClick={() => cycleSort("utilizationRate")} scope="col">
              Utilization
              <SortIndicator active={sortBy === "utilizationRate"} dir={sortDir} />
            </th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const shown = room.amenities.slice(0, 3);
            const more = room.amenities.length - shown.length;
            const tip = room.amenities.slice(3).map((a) => ROOM_AMENITY_LABELS[a]).join(", ");
            const util = room.utilizationRate;
            const barClass =
              util >= 90 ? styles.progressFillHigh : util >= 70 ? styles.progressFillWarn : styles.progressFill;
            return (
              <tr key={room.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 999,
                        background: room.color,
                        flexShrink: 0,
                      }}
                      aria-hidden
                    />
                    <div>
                      <strong>{room.name}</strong>
                      <div className={styles.subtle}>{room.floor ?? "—"}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={styles.typeBadge}>{ROOM_TYPE_LABELS[room.type]}</span>
                </td>
                <td>{room.capacity} clients</td>
                <td>
                  <span title={tip || undefined}>
                    {shown.map((a) => (
                      <span key={a} style={{ marginRight: 4 }}>
                        {AMENITY_ICONS[a]}
                      </span>
                    ))}
                    {more > 0 ? <span className={styles.subtle}>+{more}</span> : null}
                  </span>
                </td>
                <td>
                  {room.openTime} – {room.closeTime}
                </td>
                <td>{room.todaySessionCount}</td>
                <td>
                  <div className={styles.progressTrack} style={{ maxWidth: 120 }}>
                    <div className={barClass} style={{ width: `${Math.min(100, util)}%` }} />
                  </div>
                  <span className={styles.subtle}>{util}%</span>
                </td>
                <td>
                  <RoomStatusBadge status={room.status} />
                </td>
                <td>
                  <div className={styles.actionsRow}>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={`Schedule ${room.name}`}
                      onClick={() => toggleSchedulePanel(room.id)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      aria-label={`Edit ${room.name}`}
                      onClick={() => openEditModal(room.id)}
                    >
                      <Pencil size={16} />
                    </button>
                    <RowMenu room={room} onDeleteRequest={onDeleteRequest} onClearMaintenance={onClearMaintenance} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
