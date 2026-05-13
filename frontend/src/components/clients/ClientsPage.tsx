"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import { ClientsBulkBar } from "./ClientsBulkBar";
import { ClientsFiltersBar } from "./ClientsFiltersBar";
import { ClientsPageHeader } from "./ClientsPageHeader";
import { ClientsTableCard } from "./ClientsTableCard";
import { NewClientForm } from "../../forms/NewClientForm";
import { PAGE_SIZE } from "@/data/clientsData/clientsDashboardData";
import { downloadCsv, NUMBER } from "../../utils/clientsDashboardUtils";
import { ClientStatus, SortBy, SortDir } from "../../types/clientsDashboardTypes";
import { useClients } from "../../hooks/useClients";
import { ClientResponse } from "@/api/v1/clientsApi";
import { Client } from "../../types/clientsDashboardTypes";

function toClient(r: ClientResponse): Client {
  return {
    id: r.id,
    fullName: r.fullName,
    email: r.email,
    number: r.number,
    organization: r.organization,
    address: r.address,
    status: (r.status === "inactive" ? "inactive" : "active") as ClientStatus,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function ClientsDashboardPage() {
  const { data: rawClients, isLoading, isError } = useClients();
  const clients = useMemo(() => (rawClients ?? []).map(toClient), [rawClients]);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | ClientStatus>("");
  const [sortBy, setSortBy] = useState<SortBy>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isAddingClient, setIsAddingClient] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filteredClients = useMemo(() => {
    const list = clients.filter((client) => {
      const searchMatch =
        !search ||
        client.fullName.toLowerCase().includes(search) ||
        client.email.toLowerCase().includes(search) ||
        client.number.toLowerCase().includes(search) ||
        (client.organization ?? "").toLowerCase().includes(search);
      const statusMatch = !statusFilter || client.status === statusFilter;
      return searchMatch && statusMatch;
    });

    list.sort((a, b) => {
      let cmp = 0;
      if (sortBy === "name") cmp = a.fullName.localeCompare(b.fullName);
      if (sortBy === "createdAt") cmp = a.createdAt.localeCompare(b.createdAt);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return list;
  }, [clients, search, statusFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filteredClients.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const allOnCurrentPageSelected =
    paginated.length > 0 && paginated.every((c) => selectedIds.has(c.id));
  const selectedClients = filteredClients.filter((c) => selectedIds.has(c.id));

  return (
    <DashboardScaffold>
      <div className="flex flex-col gap-4">
        <ClientsPageHeader
          totalClients={NUMBER.format(filteredClients.length)}
          onAddClient={() => setIsAddingClient((v) => !v)}
        />

        <NewClientForm
          isOpen={isAddingClient}
          onClose={() => setIsAddingClient(false)}
        />

        {isLoading && (
          <p className="text-center text-sm text-slate-500 py-6">Loading clients…</p>
        )}
        {isError && (
          <p className="text-center text-sm text-red-500 py-6">
            Failed to load clients. Make sure the backend is running.
          </p>
        )}

        {!isLoading && (
          <>
            <ClientsFiltersBar
              searchInput={searchInput}
              statusFilter={statusFilter}
              sortBy={sortBy}
              sortDir={sortDir}
              onSearchInputChange={(value) => { setSearchInput(value); setPage(1); }}
              onStatusFilterChange={(value) => { setStatusFilter(value); setPage(1); }}
              onSortChange={(nextBy, nextDir) => { setSortBy(nextBy); setSortDir(nextDir); setPage(1); }}
              onClearFilters={() => {
                setSearchInput("");
                setStatusFilter("");
                setSortBy("createdAt");
                setSortDir("desc");
                setPage(1);
              }}
              onExportCsv={() => downloadCsv(filteredClients, "clients-export.csv")}
            />

            {selectedClients.length > 0 && (
              <ClientsBulkBar
                selectedCount={NUMBER.format(selectedClients.length)}
                onBulkExport={() => downloadCsv(selectedClients, "selected-clients.csv")}
              />
            )}

            <ClientsTableCard
              paginated={paginated}
              selectedIds={selectedIds}
              allOnCurrentPageSelected={allOnCurrentPageSelected}
              safePage={safePage}
              totalPages={totalPages}
              onAddClient={() => setIsAddingClient(true)}
              onToggleSelectAllPage={(checked) => {
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  paginated.forEach((c) => (checked ? next.add(c.id) : next.delete(c.id)));
                  return next;
                });
              }}
              onToggleSelectClient={(clientId, checked) => {
                setSelectedIds((prev) => {
                  const next = new Set(prev);
                  checked ? next.add(clientId) : next.delete(clientId);
                  return next;
                });
              }}
              onPreviousPage={() => setPage((p) => Math.max(1, p - 1))}
              onNextPage={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </>
        )}
      </div>
    </DashboardScaffold>
  );
}
