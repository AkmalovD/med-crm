import { Service, ServicePackage, ServicesViewMode } from "@/types/servicesDashboardTypes";

export const NUMBER = new Intl.NumberFormat("en-US");

export function currency(value: number, code = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0,
  }).format(value);
}

export function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function nextStatus(current: "active" | "inactive") {
  return current === "active" ? "inactive" : "active";
}

function toServiceCsv(rows: Service[]) {
  const header = [
    "Service",
    "Category",
    "Price",
    "Duration",
    "Delivery",
    "Status",
    "Bookings",
    "Revenue",
  ];
  const body = rows.map((item) => [
    item.name,
    item.category,
    `${item.currency} ${item.price}`,
    `${item.defaultDuration} min`,
    item.deliveryMethod,
    item.status,
    `${item.totalBookings}`,
    `${item.totalRevenue}`,
  ]);
  return [header, ...body]
    .map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

function toPackagesCsv(rows: ServicePackage[]) {
  const header = ["Package", "Service ID", "Sessions", "Price", "Validity Days", "Status", "Sold"];
  const body = rows.map((item) => [
    item.name,
    item.serviceId,
    `${item.sessionCount}`,
    `${item.currency} ${item.price}`,
    `${item.validityDays}`,
    item.status,
    `${item.totalSold}`,
  ]);
  return [header, ...body]
    .map((line) => line.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(","))
    .join("\n");
}

export function downloadServicesCsv(rows: Service[], fileName: string) {
  const blob = new Blob([toServiceCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadPackagesCsv(rows: ServicePackage[], fileName: string) {
  const blob = new Blob([toPackagesCsv(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function parseViewMode(input: string): ServicesViewMode {
  return input === "list" ? "list" : "grid";
}
