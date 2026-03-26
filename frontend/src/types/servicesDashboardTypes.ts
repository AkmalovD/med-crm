export type ServiceStatus = "active" | "inactive";
export type DeliveryMethod = "in_person" | "online" | "both";
export type ServiceTab = "services" | "packages" | "categories";
export type ServicesViewMode = "grid" | "list";
export type SortDir = "asc" | "desc";
export type ServiceSortBy = "name" | "price" | "bookings" | "createdAt";

export type ServiceCategoryKey =
  | "individual_therapy"
  | "group_therapy"
  | "assessment"
  | "consultation"
  | "online_session"
  | "custom";

export interface Service {
  id: string;
  name: string;
  description: string | null;
  category: ServiceCategoryKey;
  price: number;
  currency: string;
  taxRate: number;
  taxIncluded: boolean;
  defaultDuration: number;
  deliveryMethod: DeliveryMethod;
  color: string;
  assignedTherapistIds: string[];
  status: ServiceStatus;
  isDefault: boolean;
  totalBookings: number;
  totalRevenue: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string | null;
  serviceId: string;
  sessionCount: number;
  price: number;
  currency: string;
  validityDays: number;
  status: ServiceStatus;
  totalSold: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCategory {
  id: string;
  key: ServiceCategoryKey;
  name: string;
  color: string;
}
