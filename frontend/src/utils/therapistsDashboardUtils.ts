import { Therapist } from "@/types/therapistsDashboardTypes";

export const NUMBER = new Intl.NumberFormat("en-US");

export function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(value: string | null) {
  if (!value) return "Never";
  const delta = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(delta / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function toCsv(rows: Therapist[]) {
  const header = ["Full Name", "Email", "Phone", "Status", "Employment", "Clients", "Join Date"];
  const body = rows.map((item) => [
    item.fullName,
    item.email,
    item.phone,
    item.status,
    item.employmentType,
    `${item.currentClientCount}/${item.maxClientsCapacity}`,
    item.joinDate,
  ]);
  return [header, ...body]
    .map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export function downloadCsv(rows: Therapist[], fileName: string) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

