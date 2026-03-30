"use client";

import { FormEvent, useState } from "react";

import { ALL_ROOM_AMENITIES, ROOM_AMENITY_LABELS } from "@/data/roomsData/roomsDashboardData";
import { createRoomSchema, type CreateRoomInput } from "@/validators/createRoom.schema";
import { DropdownSelect } from "../custom-ui/dropdown";

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

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRoomInput) => void;
}

export function CreateRoomModal({ isOpen, onClose, onSubmit }: CreateRoomModalProps) {
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

  if (!isOpen) return null;

  const toggleAmenity = (key: string) => {
    setAmenities((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

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
    onSubmit(parsed.data);
    setName("");
    setDescription("");
    setType("individual");
    setCapacity("2");
    setFloor("");
    setColor("#4acf7f");
    setAmenities(new Set());
    setOpenTime("08:00");
    setCloseTime("20:00");
    onClose();
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="create-room-title">
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 id="create-room-title" className={styles.modalTitle}>
            Add room
          </h2>
          <button type="button" className={styles.ghostButton} onClick={onClose}>
            Close
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalBody}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cr-name">
                Room name *
              </label>
              <input
                id="cr-name"
                className={styles.fieldInput}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Therapy Room A"
              />
              {errors.name ? <span className={styles.fieldError}>{errors.name}</span> : null}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cr-desc">
                Description
              </label>
              <textarea
                id="cr-desc"
                className={styles.fieldTextarea}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cr-type">
                Room type *
              </label>
              <DropdownSelect
                triggerClassName={styles.fieldSelect}
                value={type}
                onChange={(e) => setType(e.target.value as CreateRoomInput["type"])}
                options={[
                  { value: "individual", label: "Individual" },
                  { value: "group", label: "Group" },
                  { value: "assessment", label: "Assessment" },
                  { value: "waiting", label: "Waiting area" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cr-cap">
                Capacity *
              </label>
              <input
                id="cr-cap"
                type="number"
                min={1}
                max={50}
                className={styles.fieldInput}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
              <span className={styles.subtle}>Maximum clients at once</span>
              {errors.capacity ? <span className={styles.fieldError}>{errors.capacity}</span> : null}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cr-floor">
                Floor / location
              </label>
              <input
                id="cr-floor"
                className={styles.fieldInput}
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                placeholder="1st Floor"
              />
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Operating hours *</span>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <DropdownSelect
                  triggerClassName={styles.fieldSelect}
                  value={openTime}
                  onChange={(e) => setOpenTime(e.target.value)}
                  aria-label="Open time"
                  options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
                />
                <DropdownSelect
                  triggerClassName={styles.fieldSelect}
                  value={closeTime}
                  onChange={(e) => setCloseTime(e.target.value)}
                  aria-label="Close time"
                  options={TIME_OPTIONS.map((t) => ({ value: t, label: t }))}
                />
              </div>
              {errors.closeTime ? <span className={styles.fieldError}>{errors.closeTime}</span> : null}
            </div>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="cr-color">
                Calendar color
              </label>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  id="cr-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  aria-label="Pick color"
                />
                <input
                  className={styles.fieldInput}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  pattern="^#[0-9A-Fa-f]{6}$"
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
              Create room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
