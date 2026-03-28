"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Accessibility,
  Activity,
  Archive,
  ClipboardList,
  Droplets,
  Eye,
  Laptop,
  Monitor,
  MoreHorizontal,
  Pencil,
  Sparkles,
  Sun,
  Volume2,
  Wrench,
} from "lucide-react";

import { ROOM_AMENITY_LABELS, ROOM_TYPE_LABELS } from "@/data/roomsData/roomsDashboardData";
import { useRoomStore } from "@/store/useRoomStore";
import type { Room, RoomAmenity } from "@/types/roomsDashboardTypes";

import { RoomStatusBadge } from "./RoomStatusBadge";
import styles from "./RoomsDashboardPage.module.css";

const AMENITY_ICONS: Record<RoomAmenity, ReactNode> = {
  projector: <Monitor size={12} aria-hidden />,
  whiteboard: <ClipboardList size={12} aria-hidden />,
  mirror: <Sparkles size={12} aria-hidden />,
  computer: <Laptop size={12} aria-hidden />,
  therapy_equipment: <Activity size={12} aria-hidden />,
  audio_system: <Volume2 size={12} aria-hidden />,
  natural_light: <Sun size={12} aria-hidden />,
  wheelchair_accessible: <Accessibility size={12} aria-hidden />,
  sink: <Droplets size={12} aria-hidden />,
  storage: <Archive size={12} aria-hidden />,
};

interface RoomCardProps {
  room: Room;
  onDeleteRequest: (room: Room) => void;
  onClearMaintenance: (roomId: string) => void;
}

export function RoomCard({ room, onDeleteRequest, onClearMaintenance }: RoomCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleSchedulePanel = useRoomStore((s) => s.toggleSchedulePanel);
  const openEditModal = useRoomStore((s) => s.openEditModal);
  const openMaintenanceModal = useRoomStore((s) => s.openMaintenanceModal);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [menuOpen]);

  const visibleAmenities = room.amenities.slice(0, 4);
  const moreCount = Math.max(0, room.amenities.length - 4);
  const moreTitle = room.amenities.slice(4).map((a) => ROOM_AMENITY_LABELS[a]).join(", ");

  const util = room.utilizationRate;
  const progressClass =
    util >= 90 ? styles.progressFillHigh : util >= 70 ? styles.progressFillWarn : styles.progressFill;

  return (
    <article className={styles.roomCard}>
      <div className={styles.colorBar} style={{ backgroundColor: room.color }} />
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.typeBadge}>{ROOM_TYPE_LABELS[room.type]}</span>
          <RoomStatusBadge status={room.status} />
        </div>
        <div>
          <h2 className={styles.roomTitle}>{room.name}</h2>
          <p className={styles.roomSub}>
            {room.floor ? `${room.floor} · ` : ""}Capacity: {room.capacity}
          </p>
        </div>

        <div>
          <p className={styles.sectionLabel}>Amenities</p>
          <div className={styles.amenityRow}>
            {visibleAmenities.map((a) => (
              <span key={a} className={styles.amenityChip}>
                {AMENITY_ICONS[a]}
                {ROOM_AMENITY_LABELS[a]}
              </span>
            ))}
            {moreCount > 0 ? (
              <span className={styles.moreAmenities} title={moreTitle}>
                +{moreCount} more
              </span>
            ) : null}
          </div>
        </div>

        <div>
          <p className={styles.sectionLabel}>Today</p>
          <p className={styles.subtle} style={{ margin: 0 }}>
            {room.todaySessionCount} session{room.todaySessionCount === 1 ? "" : "s"} booked
          </p>
          <div className={styles.progressTrack}>
            <div className={progressClass} style={{ width: `${Math.min(100, util)}%` }} />
          </div>
          <div className={styles.actionsRow} style={{ marginTop: 4 }}>
            <span className={styles.subtle}>Utilization this week</span>
            <span className={styles.subtle} style={{ fontWeight: 700, color: "#0f172a" }}>
              {util}%
            </span>
          </div>
        </div>

        <p className={styles.subtle} style={{ margin: 0 }}>
          Operating: {room.openTime} – {room.closeTime}
        </p>

        <div className={styles.cardActions}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Schedule for ${room.name}`}
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
          <div className={styles.dropdownWrap} ref={menuRef}>
            <button
              type="button"
              className={styles.menuButton}
              aria-expanded={menuOpen}
              aria-haspopup="true"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <MoreHorizontal size={16} />
            </button>
            {menuOpen ? (
              <div className={styles.dropdownMenu} role="menu">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    openMaintenanceModal(room.id);
                  }}
                >
                  Set maintenance
                </button>
                {room.status === "maintenance" ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      onClearMaintenance(room.id);
                    }}
                  >
                    Clear maintenance
                  </button>
                ) : null}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false);
                    onDeleteRequest(room);
                  }}
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {room.status === "maintenance" ? (
        <div className={styles.maintenanceOverlay}>
          <Wrench size={28} color="#ef4444" aria-hidden />
          <p style={{ margin: 0, fontWeight: 700, color: "#b91c1c" }}>Under maintenance</p>
          {room.maintenanceUntil ? (
            <p style={{ margin: 0, fontSize: 12, color: "#991b1b" }}>Until {room.maintenanceUntil}</p>
          ) : null}
          <button
            type="button"
            className={styles.ghostButton}
            style={{ marginTop: 4 }}
            onClick={() => onClearMaintenance(room.id)}
          >
            Clear maintenance
          </button>
        </div>
      ) : null}
    </article>
  );
}
