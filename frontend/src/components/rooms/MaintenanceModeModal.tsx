"use client";

import { FormEvent, useEffect, useState } from "react";
import { AlertTriangle, CheckCircle } from "lucide-react";

import { ROOM_SCHEDULE_MOCK } from "@/data/roomsData/roomsDashboardData";
import type { Room } from "@/types/roomsDashboardTypes";
import { countBookingConflictsInRange } from "@/utils/roomsDashboardUtils";
import { maintenanceSchema } from "@/validators/maintenance.schema";

import styles from "./RoomsDashboardPage.module.css";

interface MaintenanceModeModalProps {
  isOpen: boolean;
  room: Room | null;
  onClose: () => void;
  onSetMaintenance: (
    id: string,
    payload: { maintenanceFrom: string; maintenanceUntil: string; maintenanceNote: string | null },
  ) => void;
  onClearMaintenance: (id: string) => void;
}

export function MaintenanceModeModal({
  isOpen,
  room,
  onClose,
  onSetMaintenance,
  onClearMaintenance,
}: MaintenanceModeModalProps) {
  const [from, setFrom] = useState("");
  const [until, setUntil] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (room && isOpen) {
      setFrom(room.maintenanceFrom ?? "");
      setUntil(room.maintenanceUntil ?? "");
      setNote(room.maintenanceNote ?? "");
      setErrors({});
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const slotsByDate = ROOM_SCHEDULE_MOCK[room.id] ?? {};
  const conflictCount =
    from && until ? countBookingConflictsInRange(slotsByDate, from, until) : 0;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = maintenanceSchema.safeParse({
      maintenanceFrom: from,
      maintenanceUntil: until,
      maintenanceNote: note.trim() || undefined,
    });
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path[0];
        if (typeof path === "string" && !next[path]) next[path] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    onSetMaintenance(room.id, {
      maintenanceFrom: parsed.data.maintenanceFrom,
      maintenanceUntil: parsed.data.maintenanceUntil,
      maintenanceNote: parsed.data.maintenanceNote?.trim() ? parsed.data.maintenanceNote.trim() : null,
    });
    onClose();
  };

  const handleClear = () => {
    if (!window.confirm("Mark this room as available again?")) return;
    onClearMaintenance(room.id);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="maint-room-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 id="maint-room-title" className={styles.modalTitle}>
            Maintenance mode
          </h2>
          <button type="button" className={styles.ghostButton} onClick={onClose}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <p className={styles.subtle} style={{ margin: 0 }}>
              Room: <strong>{room.name}</strong>
            </p>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="mf-from">
                Maintenance from *
              </label>
              <input
                id="mf-from"
                type="date"
                className={styles.fieldInput}
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
              {errors.maintenanceFrom ? (
                <span className={styles.fieldError}>{errors.maintenanceFrom}</span>
              ) : null}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="mf-until">
                Maintenance until *
              </label>
              <input
                id="mf-until"
                type="date"
                className={styles.fieldInput}
                value={until}
                onChange={(e) => setUntil(e.target.value)}
              />
              {errors.maintenanceUntil ? (
                <span className={styles.fieldError}>{errors.maintenanceUntil}</span>
              ) : null}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="mf-note">
                Note
              </label>
              <textarea
                id="mf-note"
                className={styles.fieldTextarea}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                maxLength={300}
                placeholder="Deep cleaning, equipment repair…"
              />
            </div>
            {conflictCount > 0 ? (
              <div className={styles.warningBox}>
                <AlertTriangle size={16} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 4 }} />
                {conflictCount} session{conflictCount > 1 ? "s" : ""} already booked in this period. Reschedule them
                manually if needed.
              </div>
            ) : null}
          </div>
          <div className={styles.modalFooter}>
            {room.status === "maintenance" ? (
              <button
                type="button"
                className={styles.ghostButton}
                style={{ borderColor: "#4acf7f", color: "#15803d" }}
                onClick={handleClear}
              >
                <CheckCircle size={16} />
                <span style={{ marginLeft: 6 }}>Mark as available</span>
              </button>
            ) : null}
            <button type="button" className={styles.ghostButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton}>
              Save maintenance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
