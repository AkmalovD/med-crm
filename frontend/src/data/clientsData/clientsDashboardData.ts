import { ClientStatus } from "@/types/clientsDashboardTypes";

export const PAGE_SIZE = 8;

export const STATUS_LABELS: Record<ClientStatus, string> = {
  active: "Active",
  inactive: "Inactive",
};
