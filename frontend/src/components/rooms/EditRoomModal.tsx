"use client";

import { FormEvent, useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

import { ALL_ROOM_AMENITIES, ROOM_AMENITY_LABELS } from "@/data/roomsData/roomsDashboardData";
import type { Room } from "@/types/roomsDashboardTypes";
import { createRoomSchema, type CreateRoomInput } from "@/validators/createRoom.schema";

import styles from "./RoomsDashboardPage.module.css";

const TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let h = 6; h < 24; h++) {
    for (const m of [0, 30] as const) {
      if (h === 23 && m === 30) break;
      out.push(`${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`);
    }
  }
  return out;
})();

interface EditRoomModalProps {
  isOpen: boolean;
  room: Room | null;
  onClose: () => void;
  onSubmit: (id: string, data: Partial<CreateRoomInput>) => void;
}

export function EditRoomModal({ isOpen, room, onClose, onSubmit }: EditRoomModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CreateRoomInput["type"]>("individual");
  const [capacity, setCapacity] = useState("2");
  const [floor, setFloor] = useState("");
  const [color, setColor] = useState("#4acf7f");
  const [amenities, setAmenities] = useState<Set<string>>(new Set());
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialCapacity, setInitialCapacity] = useState(2);

  useEffect(() => {
    if (!room || !isOpen) return;
    setName(room.name);
    setDescription(room.description ?? "");
    setType(room.type);
    setCapacity(String(room.capacity));
    setInitialCapacity(room.capacity);
    setFloor(room.floor ?? "");
    setColor(room.color);
    setAmenities(new Set(room.amenities));
    setOpenTime(room.openTime);
    setCloseTime(room.closeTime);
    setErrors({});
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const toggleAmenity = (key: string) => {
    setAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const capacityReduced =
    room.upcomingBookingsCount > 0 && Number(capacity) < initialCapacity && Number(capacity) >= 1;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const raw = {
      name: name.trim(),
      description: description.trim() || undefined,
      type,
      capacity,
      floor: floor.trim() || undefined,
      color,
      amenities: Array.from(amenities) as CreateRoomInput["amenities"],
      openTime,
      closeTime,
    };
    const parsed = createRoomSchema.safeParse(raw);
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
    onSubmit(room.id, parsed.data);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="edit-room-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 id="edit-room-title" className={styles.modalTitle}>
            Edit room
          </h2>
          <button type="button" className={styles.ghostButton} onClick={onClose}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            {capacityReduced ? (
              <div className={styles.warningBox}>
                <AlertTriangle size={16} style={{ display: "inline", verticalAlign: "text-bottom", marginRight: 4 }} />
                This room has upcoming bookings. Reducing capacity may conflict with group sessions.
              </div>
            ) : null}
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="er-name">
                Room name *
              </label>
              <input
                id="er-name"
                className={styles.fieldInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name ? <span className={styles.fieldError}>{errors.name}</span> : null}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="er-desc">
                Description
              </label>
              <textarea
                id="er-desc"
                className={styles.fieldTextarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="er-type">
                Room type *
              </label>
              <select
                id="er-type"
                className={styles.fieldSelect}
                value={type}
                onChange={(e) => setType(e.target.value as CreateRoomInput["type"])}
              >
                <option value="individual">Individual</option>
                <option value="group">Group</option>
                <option value="assessment">Assessment</option>
                <option value="waiting">Waiting area</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="er-cap">
                Capacity *
              </label>
              <input
                id="er-cap"
                type="number"
                min={1}
                max={50}
                className={styles.fieldInput}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
              {errors.capacity ? <span className={styles.fieldError}>{errors.capacity}</span> : null}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="er-floor">
                Floor / location
              </label>
              <input
                id="er-floor"
                className={styles.fieldInput}
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Operating hours *</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <select
                  className={styles.fieldSelect}
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  aria-label="Open time"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <select
                  className={styles.fieldSelect}
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  aria-label="Close time"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              {errors.closeTime ? <span className={styles.fieldError}>{errors.closeTime}</span> : null}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="er-color">
                Calendar color
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  id="er-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  aria-label="Pick color"
                />
                <input
                  className={styles.fieldInput}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
              {errors.color ? <span className={styles.fieldError}>{errors.color}</span> : null}
            </div>
            <div>
              <p className={styles.fieldLabel}>Amenities</p>
              <div className={styles.amenityGrid}>
                {ALL_ROOM_AMENITIES.map((a) => (
                  <label key={a} className={styles.amenityCheck}>
                    <input type="checkbox" checked={amenities.has(a)} onChange={() => toggleAmenity(a)} />
                    {ROOM_AMENITY_LABELS[a]}
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.ghostButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.primaryButton}>
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
