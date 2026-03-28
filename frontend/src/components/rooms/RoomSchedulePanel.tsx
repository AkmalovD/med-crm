"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { AppointmentStatusBadge } from "@/components/appointments/AppointmentStatusBadge";
import type { Room, RoomScheduleSlot } from "@/types/roomsDashboardTypes";
import { addDaysIso, formatShortDate, hourSlotsBetween } from "@/utils/roomsDashboardUtils";

import styles from "./RoomsDashboardPage.module.css";

interface RoomSchedulePanelProps {
  room: Room;
  getSlots: (roomId: string, isoDate: string) => RoomScheduleSlot[];
  onClose: () => void;
}

function slotStartsInHour(slot: RoomScheduleSlot, hour: number): boolean {
  const [h] = slot.startTime.split(":").map(Number);
  return h === hour;
}

export function RoomSchedulePanel({ room, getSlots, onClose }: RoomSchedulePanelProps) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  });

  const slots = useMemo(() => getSlots(room.id, selectedDate), [getSlots, room.id, selectedDate]);

  const hours = useMemo(() => hourSlotsBetween(room.openTime, room.closeTime), [room.openTime, room.closeTime]);

  const freeCount = useMemo(() => {
    const hoursWithBooking = new Set<number>();
    for (const s of slots) {
      const [h] = s.startTime.split(":").map(Number);
      hoursWithBooking.add(h);
    }
    return hours.filter((h) => !hoursWithBooking.has(h)).length;
  }, [hours, slots]);

  return (
    <aside className={styles.schedulePanel} aria-label="Room schedule">
      <div className={styles.scheduleHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{ width: 12, height: 12, borderRadius: 999, background: room.color }}
            aria-hidden
          />
          <p style={{ margin: 0, fontWeight: 700, color: "#0f172a" }}>{room.name}</p>
        </div>
        <button type="button" className={styles.iconButton} onClick={onClose} aria-label="Close schedule panel">
          <X size={18} />
        </button>
      </div>

      <div className={styles.scheduleDateRow}>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Previous day"
          onClick={() => setSelectedDate((d) => addDaysIso(d, -1))}
        >
          <ChevronLeft size={18} />
        </button>
        <span style={{ fontSize: 13, fontWeight: 600 }}>{formatShortDate(selectedDate)}</span>
        <button
          type="button"
          className={styles.iconButton}
          aria-label="Next day"
          onClick={() => setSelectedDate((d) => addDaysIso(d, 1))}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className={styles.scheduleBody}>
        {hours.flatMap((hour) => {
          const hourSlots = slots.filter((s) => slotStartsInHour(s, hour));
          if (hourSlots.length > 0) {
            return hourSlots.map((slot) => (
              <div
                key={slot.id}
                className={styles.slotCard}
                style={{
                  backgroundColor: `${room.color}18`,
                  borderLeftColor: room.color,
                }}
              >
                <p style={{ margin: "0 0 4px", fontWeight: 700 }}>
                  {slot.startTime} – {slot.endTime}
                </p>
                <p style={{ margin: 0, color: "#64748b", fontSize: 13 }}>{slot.clientName}</p>
                <p style={{ margin: "2px 0 6px", color: "#94a3b8", fontSize: 12 }}>{slot.therapistName}</p>
                <p style={{ margin: "0 0 6px", fontSize: 12, color: "#64748b" }}>{slot.serviceName}</p>
                <AppointmentStatusBadge status={slot.status} />
              </div>
            ));
          }
          return [
            <div key={hour} className={styles.slotEmpty}>
              {String(hour).padStart(2, "0")}:00 · Free
            </div>,
          ];
        })}
      </div>

      <div className={styles.scheduleFooter}>
        {slots.length} session{slots.length === 1 ? "" : "s"} on {formatShortDate(selectedDate)} · {freeCount} free
        hour slots
      </div>
    </aside>
  );
}
