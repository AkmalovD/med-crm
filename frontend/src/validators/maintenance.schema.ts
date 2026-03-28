import { z } from "zod";

export const maintenanceSchema = z
  .object({
    maintenanceFrom: z.string().min(1, "Start date is required"),
    maintenanceUntil: z.string().min(1, "End date is required"),
    maintenanceNote: z.string().max(300).optional(),
  })
  .refine((d) => new Date(d.maintenanceFrom) <= new Date(d.maintenanceUntil), {
    message: "End date must be on or after start date",
    path: ["maintenanceUntil"],
  });

export type MaintenanceInput = z.infer<typeof maintenanceSchema>;
