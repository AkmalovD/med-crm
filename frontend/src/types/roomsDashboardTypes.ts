import type { AppointmentStatus } from "@/types/appointmentsDashboardTypes";

export type RoomStatus = "available" | "occupied" | "maintenance";

export type RoomType = "individual" | "group" | "assessment" | "waiting" | "other";

export type RoomAmenity =
  | "projector"
  | "whiteboard"
  | "mirror"
  | "computer"
  | "therapy_equipment"
  | "audio_system"
  | "natural_light"
  | "wheelchair_accessible"
  | "sink"
  | "storage";

export interface Room {
  id: string;
  name: string;
  description: string | null;
  type: RoomType;
  capacity: number;
  floor: string | null;
  color: string;
  amenities: RoomAmenity[];
  openTime: string;
  closeTime: string;
  status: RoomStatus;
  maintenanceFrom: string | null;
  maintenanceUntil: string | null;
  maintenanceNote: string | null;
  todaySessionCount: number;
  utilizationRate: number;
  upcomingBookingsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RoomScheduleSlot {
  id: string;
  startTime: string;
  endTime: string;
  clientName: string;
  therapistName: string;
  serviceName: string;
  status: AppointmentStatus;
}

export type RoomSortBy = "name" | "capacity" | "utilizationRate";
export type SortDir = "asc" | "desc";
export type RoomsViewMode = "grid" | "list";

export interface RoomFilters {
  search: string;
  type: "" | RoomType;
  status: "" | RoomStatus;
  view: RoomsViewMode;
  page: number;
  sortBy: RoomSortBy;
  sortDir: SortDir;
}
