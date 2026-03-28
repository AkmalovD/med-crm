import { z } from "zod";

const amenityEnum = z.enum([
  "projector",
  "whiteboard",
  "mirror",
  "computer",
  "therapy_equipment",
  "audio_system",
  "natural_light",
  "wheelchair_accessible",
  "sink",
  "storage",
]);

/** Base shape — no refinements (Zod 4 forbids `.partial()` after `.refine()`). */
const roomFieldsSchema = z.object({
  name: z.string().min(1, "Room name is required").max(60),
  description: z.string().max(300).optional(),
  type: z.enum(["individual", "group", "assessment", "waiting", "other"]),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1").max(50),
  floor: z.string().max(40).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Use a valid hex color"),
  amenities: z.array(amenityEnum).default([]),
  openTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  closeTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
});

export const createRoomSchema = roomFieldsSchema.refine((d) => d.openTime < d.closeTime, {
  message: "Close time must be after open time",
  path: ["closeTime"],
});

export const updateRoomSchema = roomFieldsSchema.partial().refine(
  (d) => d.openTime == null || d.closeTime == null || d.openTime < d.closeTime,
  {
    message: "Close time must be after open time",
    path: ["closeTime"],
  },
);

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
