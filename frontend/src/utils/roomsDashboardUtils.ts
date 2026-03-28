import type {
  Room,
  RoomFilters,
  RoomScheduleSlot,
  RoomSortBy,
  RoomsViewMode,
  SortDir,
} from "@/types/roomsDashboardTypes";

export function parseRoomsViewMode(value: string | null | undefined): RoomsViewMode {
  return value === "list" ? "list" : "grid";
}

export function parseRoomTypeParam(value: string | null): RoomFilters["type"] {
  const allowed = ["individual", "group", "assessment", "waiting", "other"] as const;
  return allowed.includes(value as (typeof allowed)[number]) ? (value as RoomFilters["type"]) : "";
}

export function parseRoomStatusParam(value: string | null): RoomFilters["status"] {
  const allowed = ["available", "occupied", "maintenance"] as const;
  return allowed.includes(value as (typeof allowed)[number]) ? (value as RoomFilters["status"]) : "";
}

export function parseSortBy(value: string | null): RoomSortBy {
  if (value === "capacity" || value === "utilizationRate") return value;
  return "name";
}

export function parseSortDir(value: string | null): SortDir {
  return value === "desc" ? "desc" : "asc";
}

export function parsePage(value: string | null): number {
  const n = Number(value);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

export function buildRoomsSearchParams(filters: RoomFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.type) params.set("type", filters.type);
  if (filters.status) params.set("status", filters.status);
  if (filters.view !== "grid") params.set("view", filters.view);
  if (filters.page > 1) params.set("page", String(filters.page));
  if (filters.sortBy !== "name") params.set("sortBy", filters.sortBy);
  if (filters.sortDir !== "asc") params.set("sortDir", filters.sortDir);
  return params;
}

export function filterAndSortRooms(
  rooms: Room[],
  search: string,
  type: RoomFilters["type"],
  status: RoomFilters["status"],
  sortBy: RoomSortBy,
  sortDir: SortDir,
): Room[] {
  const q = search.trim().toLowerCase();
  const list = rooms.filter((room) => {
    const searchMatch =
      !q ||
      room.name.toLowerCase().includes(q) ||
      (room.description ?? "").toLowerCase().includes(q) ||
      (room.floor ?? "").toLowerCase().includes(q);
    const typeMatch = !type || room.type === type;
    const statusMatch = !status || room.status === status;
    return searchMatch && typeMatch && statusMatch;
  });

  list.sort((left, right) => {
    let comparison = 0;
    if (sortBy === "name") comparison = left.name.localeCompare(right.name);
    if (sortBy === "capacity") comparison = left.capacity - right.capacity;
    if (sortBy === "utilizationRate") comparison = left.utilizationRate - right.utilizationRate;
    return sortDir === "asc" ? comparison : -comparison;
  });
  return list;
}

export function formatShortDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${isoDate}T12:00:00`));
  } catch {
    return isoDate;
  }
}

export function addDaysIso(isoDate: string, delta: number): string {
  const d = new Date(`${isoDate}T12:00:00`);
  d.setDate(d.getDate() + delta);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function createRoomId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `room-${crypto.randomUUID()}`;
  }
  return `room-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function hourSlotsBetween(openTime: string, closeTime: string): number[] {
  const [oh, om] = openTime.split(":").map(Number);
  const [ch, cm] = closeTime.split(":").map(Number);
  const start = oh * 60 + (om || 0);
  const end = ch * 60 + (cm || 0);
  const hours: number[] = [];
  for (let m = start; m < end; m += 60) {
    hours.push(Math.floor(m / 60));
  }
  return hours;
}

export function countBookingConflictsInRange(
  slotsByDate: Record<string, RoomScheduleSlot[]>,
  fromIso: string,
  untilIso: string,
): number {
  const from = new Date(`${fromIso}T00:00:00`);
  const until = new Date(`${untilIso}T23:59:59`);
  let count = 0;
  for (const [date, slots] of Object.entries(slotsByDate)) {
    const day = new Date(`${date}T12:00:00`);
    if (day < from || day > until) continue;
    count += slots.length;
  }
  return count;
}
