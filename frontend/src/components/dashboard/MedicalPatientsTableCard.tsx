"use client";

import { useState } from "react";
import { PAGE_SIZE } from "../../data/dashboardData/medicalDashboardData";
import { Patient } from "../../types/medicalDashboardTypes";
import { ChevronDown } from "lucide-react";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "../custom-ui/dropdown";

interface MedicalPatientsTableCardProps {
  patients: Patient[];
  totalCount: number;
  /** DB total for the card title; `null` while loading shows "…". Defaults to `totalCount`. */
  titleCount?: number | null;
  sortBy: string;
  onSortChange: (value: string) => void;
  page: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function MedicalPatientsTableCard({
  patients,
  totalCount,
  titleCount,
  sortBy,
  onSortChange,
  page,
  totalPages,
  onPreviousPage,
  onNextPage,
}: MedicalPatientsTableCardProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const headingCount =
    titleCount === null ? "…" : titleCount ?? totalCount;

  const allSelected = patients.length > 0 && patients.every((p) => selectedIds.has(p.id));
  const someSelected = patients.some((p) => selectedIds.has(p.id));

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        patients.forEach((p) => next.delete(p.id));
      } else {
        patients.forEach((p) => next.add(p.id));
      }
      return next;
    });
  };

  return (
    <div className="dashboard-orders-card">
      <div className="px-5 pt-[18px] pb-2.5 flex justify-between items-center">
        <h2 className="text-base font-bold text-slate-800">Information by patients ({headingCount})</h2>
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-slate-500">Sort By</span>
          <div className="relative inline-flex">
            <Dropdown align="end">
              <DropdownTrigger className="dashboard-select text-[13px] font-medium text-slate-700">
                <span>{sortBy}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </DropdownTrigger>
              <DropdownContent className="min-w-36">
                <DropdownItem
                  className={sortBy === "Progress" ? "bg-slate-100 text-slate-900" : undefined}
                  onClick={() => onSortChange("Progress")}
                >
                  Progress
                </DropdownItem>
                <DropdownItem
                  className={sortBy === "Name" ? "bg-slate-100 text-slate-900" : undefined}
                  onClick={() => onSortChange("Name")}
                >
                  Name
                </DropdownItem>
                <DropdownItem
                  className={sortBy === "Status" ? "bg-slate-100 text-slate-900" : undefined}
                  onClick={() => onSortChange("Status")}
                >
                  Status
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th className="w-10">
                <input
                  type="checkbox"
                  className="accent-[#4acf7f] cursor-pointer"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                  onChange={toggleAll}
                />
              </th>
              <th>PATIENT</th>
              <th>THERAPIST</th>
              <th>PROGRESS ↕</th>
              <th>NEXT SESSION</th>
              <th>COMPLETED ↕</th>
              <th>SESSIONS</th>
              <th>STATUS ↕</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                onClick={() => toggleRow(patient.id)}
                className="cursor-pointer"
              >
                <td>
                  <input
                    type="checkbox"
                    className="accent-[#4acf7f] cursor-pointer"
                    checked={selectedIds.has(patient.id)}
                    readOnly
                  />
                </td>
                <td>
                  <a href="#" className="text-[#4acf7f] font-medium no-underline text-sm hover:underline">
                    {patient.name}
                  </a>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-[25px] h-[25px] rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0"
                      style={{ background: patient.therapist.color }}
                    >
                      {patient.therapist.initials}
                    </div>
                    <span className="text-sm text-slate-600">{patient.therapist.name}</span>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1 rounded bg-gray-200 shrink-0">
                      <div className="h-full rounded bg-[#4acf7f]" style={{ width: `${patient.progress}%` }} />
                    </div>
                    <span className="text-[13px]">{patient.progress}%</span>
                  </div>
                </td>
                <td>{patient.nextSession}</td>
                <td>{patient.completed}%</td>
                <td>{patient.visits.toLocaleString()} sessions</td>
                <td>
                  <span
                    className={
                      patient.status === "Active"
                        ? "dashboard-status dashboard-status-approved"
                        : "dashboard-status dashboard-status-refunded"
                    }
                  >
                    {patient.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="dashboard-table-footer">
        <span className="text-[13px]">Rows per page: {PAGE_SIZE}</span>
        <span className="text-[13px]">
          {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, totalCount)} of {totalCount}
        </span>
        <div className="flex gap-2">
          <button type="button" className="dashboard-pager-button" onClick={onPreviousPage} disabled={page === 0}>
            ← Previous
          </button>
          <button
            type="button"
            className="dashboard-pager-button"
            onClick={onNextPage}
            disabled={page === totalPages - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
