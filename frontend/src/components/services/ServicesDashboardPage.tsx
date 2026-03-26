"use client";

import { useEffect, useMemo, useState } from "react";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import { ServiceUsageStats } from "./ServiceUsageStats";
import { ServicesCategoryManager } from "./ServicesCategoryManager";
import { ServicesFilterBar } from "./ServicesFilterBar";
import { ServicesGrid } from "./ServicesGrid";
import { ServicesPageHeader } from "./ServicesPageHeader";
import { ServicesTable } from "./ServicesTable";
import { ServicesViewToggle } from "./ServicesViewToggle";
import { PackagesTable } from "./PackagesTable";
import {
  PAGE_SIZE,
  SERVICE_CATEGORIES,
  SERVICE_PACKAGES,
  SERVICES,
} from "@/data/servicesData/servicesDashboardData";
import {
  DeliveryMethod,
  Service,
  ServiceCategoryKey,
  ServicePackage,
  ServiceSortBy,
  ServiceStatus,
  ServiceTab,
  SortDir,
} from "@/types/servicesDashboardTypes";
import {
  NUMBER,
  downloadPackagesCsv,
  downloadServicesCsv,
  nextStatus,
  parseViewMode,
} from "@/utils/servicesDashboardUtils";
import styles from "./ServicesDashboardPage.module.css";

export function ServicesDashboardPage() {
  const [activeTab, setActiveTab] = useState<ServiceTab>("services");
  const [viewMode, setViewMode] = useState(() => parseViewMode("grid"));
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"" | ServiceCategoryKey>("");
  const [statusFilter, setStatusFilter] = useState<"" | ServiceStatus>("");
  const [deliveryFilter, setDeliveryFilter] = useState<"" | DeliveryMethod>("");
  const [therapistFilter, setTherapistFilter] = useState("");
  const [sortBy, setSortBy] = useState<ServiceSortBy>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [packages, setPackages] = useState<ServicePackage[]>(SERVICE_PACKAGES);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filteredServices = useMemo(() => {
    const list = services.filter((service) => {
      const searchMatch =
        !search ||
        service.name.toLowerCase().includes(search) ||
        (service.description ?? "").toLowerCase().includes(search);
      const categoryMatch = !categoryFilter || service.category === categoryFilter;
      const statusMatch = !statusFilter || service.status === statusFilter;
      const deliveryMatch = !deliveryFilter || service.deliveryMethod === deliveryFilter;
      const therapistMatch = !therapistFilter || service.assignedTherapistIds.includes(therapistFilter);
      return searchMatch && categoryMatch && statusMatch && deliveryMatch && therapistMatch;
    });

    list.sort((left, right) => {
      let comparison = 0;
      if (sortBy === "name") comparison = left.name.localeCompare(right.name);
      if (sortBy === "price") comparison = left.price - right.price;
      if (sortBy === "bookings") comparison = left.totalBookings - right.totalBookings;
      if (sortBy === "createdAt") comparison = left.createdAt.localeCompare(right.createdAt);
      return sortDir === "asc" ? comparison : -comparison;
    });
    return list;
  }, [services, search, categoryFilter, statusFilter, deliveryFilter, therapistFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredServices.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedServices = filteredServices.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const servicesById = useMemo(
    () =>
      services.reduce<Record<string, Service>>((acc, service) => {
        acc[service.id] = service;
        return acc;
      }, {}),
    [services],
  );

  return (
    <DashboardScaffold>
      <div className={styles.page}>
        <ServicesPageHeader
          activeTab={activeTab}
          activeServicesCount={NUMBER.format(services.filter((item) => item.status === "active").length)}
        />

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === "services" ? styles.tabActive : ""}`}
            type="button"
            onClick={() => setActiveTab("services")}
          >
            Services ({services.length})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "packages" ? styles.tabActive : ""}`}
            type="button"
            onClick={() => setActiveTab("packages")}
          >
            Packages ({packages.length})
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "categories" ? styles.tabActive : ""}`}
            type="button"
            onClick={() => setActiveTab("categories")}
          >
            Categories ({SERVICE_CATEGORIES.length})
          </button>
        </div>

        {activeTab === "services" && (
          <>
            <ServiceUsageStats services={services} />
            <ServicesFilterBar
              searchInput={searchInput}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              deliveryFilter={deliveryFilter}
              therapistFilter={therapistFilter}
              sortBy={sortBy}
              sortDir={sortDir}
              onSearchInputChange={(value) => {
                setSearchInput(value);
                setPage(1);
              }}
              onCategoryChange={(value) => {
                setCategoryFilter(value);
                setPage(1);
              }}
              onStatusChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
              onDeliveryChange={(value) => {
                setDeliveryFilter(value);
                setPage(1);
              }}
              onTherapistChange={(value) => {
                setTherapistFilter(value);
                setPage(1);
              }}
              onSortChange={(nextSortBy, nextSortDir) => {
                setSortBy(nextSortBy);
                setSortDir(nextSortDir);
                setPage(1);
              }}
              onClear={() => {
                setSearchInput("");
                setCategoryFilter("");
                setStatusFilter("");
                setDeliveryFilter("");
                setTherapistFilter("");
                setSortBy("name");
                setSortDir("asc");
                setPage(1);
              }}
            />

            <div className={styles.toolRow} style={{ justifyContent: "space-between" }}>
              <ServicesViewToggle viewMode={viewMode} onChange={setViewMode} />
              <div className={styles.actionsRow}>
                <button
                  className={styles.ghostButton}
                  type="button"
                  onClick={() => downloadServicesCsv(filteredServices, "services-export.csv")}
                >
                  Export CSV
                </button>
                <span className={styles.subtle}>
                  Page {safePage} / {totalPages}
                </span>
                <button
                  className={styles.ghostButton}
                  type="button"
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                  disabled={safePage <= 1}
                >
                  Prev
                </button>
                <button
                  className={styles.ghostButton}
                  type="button"
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                  disabled={safePage >= totalPages}
                >
                  Next
                </button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <ServicesGrid
                services={paginatedServices}
                onToggleStatus={(serviceId) =>
                  setServices((current) =>
                    current.map((item) =>
                      item.id === serviceId ? { ...item, status: nextStatus(item.status) } : item,
                    ),
                  )
                }
              />
            ) : (
              <ServicesTable
                services={paginatedServices}
                onToggleStatus={(serviceId) =>
                  setServices((current) =>
                    current.map((item) =>
                      item.id === serviceId ? { ...item, status: nextStatus(item.status) } : item,
                    ),
                  )
                }
              />
            )}
          </>
        )}

        {activeTab === "packages" && (
          <>
            <div className={styles.toolRow} style={{ justifyContent: "space-between" }}>
              <p className={styles.subtle}>Session bundles with discounted pricing and validity windows.</p>
              <button
                className={styles.ghostButton}
                type="button"
                onClick={() => downloadPackagesCsv(packages, "packages-export.csv")}
              >
                Export CSV
              </button>
            </div>
            <PackagesTable
              packages={packages}
              servicesById={servicesById}
              onTogglePackageStatus={(packageId) =>
                setPackages((current) =>
                  current.map((item) =>
                    item.id === packageId ? { ...item, status: nextStatus(item.status) } : item,
                  ),
                )
              }
            />
          </>
        )}

        {activeTab === "categories" && (
          <ServicesCategoryManager categories={SERVICE_CATEGORIES} services={services} />
        )}
      </div>
    </DashboardScaffold>
  );
}
