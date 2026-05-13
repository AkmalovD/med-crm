import { Client } from "../types/clientsDashboardTypes";
import { STATUS_LABELS } from "@/data/clientsData/clientsDashboardData";

export const NUMBER = new Intl.NumberFormat("en-US");

export function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(date: string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toCsv(rows: Client[]) {
  const header = ["Full Name", "Organization", "Email", "Phone", "Address", "Status", "Created At"];

  const body = rows.map((row) => [
    row.fullName,
    row.organization ?? "",
    row.email,
    row.number,
    row.address ?? "",
    STATUS_LABELS[row.status] ?? row.status,
    formatDate(row.createdAt),
  ]);

  return [header, ...body]
    .map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export function downloadCsv(rows: Client[], fileName: string) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}
