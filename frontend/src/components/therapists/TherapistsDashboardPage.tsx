"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import { TherapistsPageHeader } from "./TherapistsPageHeader";
import { TherapistsFiltersBar } from "./TherapistsFiltersBar";
import { TherapistsTableCard } from "./TherapistsTableCard";
import styles from "./TherapistsDashboardPage.module.css";
import { PAGE_SIZE, THERAPISTS } from "@/data/therapistsData/therapistsDashboardData";
import { EmploymentType, SortDir, Specialization, TherapistSortBy, TherapistStatus } from "@/types/therapistsDashboardTypes";
import { NUMBER, downloadCsv } from "@/utils/therapistsDashboardUtils";

export function TherapistsDashboardPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | TherapistStatus>("");
  const [employmentFilter, setEmploymentFilter] = useState<"" | EmploymentType>("");
  const [specializationFilter, setSpecializationFilter] = useState<"" | Specialization>("");
  const [sortBy, setSortBy] = useState<TherapistSortBy>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim().toLowerCase()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const filteredTherapists = useMemo(() => {
    const list = THERAPISTS.filter((therapist) => {
      const searchMatch =
        !search ||
        therapist.fullName.toLowerCase().includes(search) ||
        therapist.email.toLowerCase().includes(search);
      const statusMatch = !statusFilter || therapist.status === statusFilter;
      const employmentMatch = !employmentFilter || therapist.employmentType === employmentFilter;
      const specializationMatch =
        !specializationFilter || therapist.specializations.includes(specializationFilter);
      return searchMatch && statusMatch && employmentMatch && specializationMatch;
    });

    list.sort((left, right) => {
      let comparison = 0;
      if (sortBy === "name") comparison = left.fullName.localeCompare(right.fullName);
      if (sortBy === "joinDate") comparison = left.joinDate.localeCompare(right.joinDate);
      if (sortBy === "clientCount") comparison = left.currentClientCount - right.currentClientCount;
      if (sortBy === "lastLogin")
        comparison = (left.lastLoginAt ?? "").localeCompare(right.lastLoginAt ?? "");
      return sortDir === "asc" ? comparison : -comparison;
    });

    return list;
  }, [search, statusFilter, employmentFilter, specializationFilter, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredTherapists.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filteredTherapists.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <DashboardScaffold>
      <div className={styles.page}>
        <TherapistsPageHeader totalTherapists={NUMBER.format(filteredTherapists.length)} />
        <TherapistsFiltersBar
          searchInput={searchInput}
          statusFilter={statusFilter}
          employmentFilter={employmentFilter}
          specializationFilter={specializationFilter}
          sortBy={sortBy}
          sortDir={sortDir}
          onSearchInputChange={(value) => {
            setSearchInput(value);
            setPage(1);
          }}
          onStatusFilterChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          onEmploymentFilterChange={(value) => {
            setEmploymentFilter(value);
            setPage(1);
          }}
          onSpecializationFilterChange={(value) => {
            setSpecializationFilter(value);
            setPage(1);
          }}
          onSortChange={(nextSortBy, nextSortDir) => {
            setSortBy(nextSortBy);
            setSortDir(nextSortDir);
            setPage(1);
          }}
          onClearFilters={() => {
            setSearchInput("");
            setStatusFilter("");
            setEmploymentFilter("");
            setSpecializationFilter("");
            setSortBy("name");
            setSortDir("asc");
            setPage(1);
          }}
          onExportCsv={() => downloadCsv(filteredTherapists, "therapists-export.csv")}
        />

        <TherapistsTableCard
          paginated={paginated}
          safePage={safePage}
          totalPages={totalPages}
          onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
          onNextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
        />
      </div>
    </DashboardScaffold>
  );
}

