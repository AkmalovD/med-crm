export type ClientStatus = "active" | "inactive";
export type SortBy = "name" | "createdAt";
export type SortDir = "asc" | "desc";

export interface Client {
  id: string;
  fullName: string;
  email: string;
  number: string;
  organization: string | null;
  address: string | null;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}
