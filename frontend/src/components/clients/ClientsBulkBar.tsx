import { useState } from "react";
import styles from "./ClientsDashboardPage.module.css";
import { Therapist } from "../../types/clientsDashboardTypes";
import { DropdownSelect } from "../custom-ui/dropdown";

interface ClientsBulkBarProps {
  selectedCount: string;
  therapists: Therapist[];
  onBulkExport: () => void;
}

export function ClientsBulkBar({ selectedCount, therapists, onBulkExport }: ClientsBulkBarProps) {
  const [bulkTherapistId, setBulkTherapistId] = useState("");

  return (
    <section className={styles.bulkBar}>
      <p className="text-sm font-medium text-slate-700">{selectedCount} selected</p>
      <div className="flex items-center gap-2">
        <button type="button" className={styles.bulkButton} onClick={onBulkExport}>
          Bulk Export
        </button>
        <DropdownSelect
          triggerClassName={styles.select}
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
