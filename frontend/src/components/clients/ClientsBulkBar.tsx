import { useState } from "react";
import { Therapist } from "../../types/clientsDashboardTypes";
import { DropdownSelect } from "../custom-ui/dropdown";

interface ClientsBulkBarProps {
  selectedCount: string;
  therapists: Therapist[];
  onBulkExport: () => void;
}

export function ClientsBulkBar({ selectedCount, therapists, onBulkExport }: ClientsBulkBarProps) {
  const [bulkTherapistId, setBulkTherapistId] = useState("");
  const selectClassName =
    "h-9 rounded-lg border border-(--border) bg-white px-[10px] text-[13px] text-slate-600";

  return (
    <section className="flex flex-wrap items-center justify-between gap-[10px] rounded-xl border border-[#d6e6f6] bg-[#f7fbff] px-3 py-[10px]">
      <p className="text-sm font-medium text-slate-700">{selectedCount} selected</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="h-[34px] rounded-lg border border-(--border) bg-white px-[11px] text-[13px] font-semibold text-slate-700"
          onClick={onBulkExport}
        >
          Bulk Export
        </button>
        <DropdownSelect
          triggerClassName={selectClassName}
          value={bulkTherapistId}
          onChange={(event) => setBulkTherapistId(event.target.value)}
          options={[
            { value: "", label: "Bulk assign therapist" },
            ...therapists.map((therapist) => ({ value: therapist.id, label: therapist.name })),
          ]}
        />
      </div>
    </section>
  );
}
