import { X } from "lucide-react";
import { DropdownSelect } from "../custom-ui/dropdown";

import { DocumentCategory, DocumentFiltersState } from "./Documents.types";
import styles from "./DocumentsDashboardPage.module.css";

interface Option {
  value: string;
  label: string;
}

interface DocumentsFilterBarProps {
  filters: DocumentFiltersState;
  clientOptions: Option[];
  therapistOptions: Option[];
  onChange: (next: DocumentFiltersState) => void;
}
// .
const CATEGORY_OPTIONS: Array<{ value: "all" | DocumentCategory; label: string }> = [
  { value: "all", label: "All Categories" },
  { value: "referral", label: "Referral" },
  { value: "assessment", label: "Assessment" },
  { value: "consent_form", label: "Consent Form" },
  { value: "progress_report", label: "Progress Report" },
  { value: "invoice", label: "Invoice" },
  { value: "other", label: "Other" },
];

export function DocumentsFilterBar({
  filters,
  clientOptions,
  therapistOptions,
  onChange,
}: DocumentsFilterBarProps) {
  const update = (key: keyof DocumentFiltersState) => (event: { target: { value: string } }) => {
    onChange({ ...filters, [key]: event.target.value });
  };

  return (
    <div className={`${styles.card} ${styles.filterRow}`} style={{ padding: "0.75rem" }}>
      <div className={styles.filterControls}>
        <input
          className={styles.input}
          placeholder="Search by name or client..."
          value={filters.search}
          onChange={update("search")}
        />
        <DropdownSelect
          triggerClassName={styles.select}
          value={filters.category}
          onChange={update("category")}
          options={CATEGORY_OPTIONS.map((item) => ({ value: item.value, label: item.label }))}
        />
        <DropdownSelect
          triggerClassName={styles.select}
          value={filters.clientId}
          onChange={update("clientId")}
          options={[{ value: "all", label: "All Clients" }, ...clientOptions]}
        />
        <DropdownSelect
          triggerClassName={styles.select}
          value={filters.therapistId}
          onChange={update("therapistId")}
          options={[{ value: "all", label: "All Therapists" }, ...therapistOptions]}
        />
        <DropdownSelect
          triggerClassName={styles.select}
          value={filters.fileType}
          onChange={update("fileType")}
          options={[
            { value: "all", label: "All Types" },
            { value: "pdf", label: "PDF" },
            { value: "jpg", label: "JPG" },
            { value: "png", label: "PNG" },
            { value: "docx", label: "DOCX" },
          ]}
        />
        <DropdownSelect
          triggerClassName={styles.select}
          value={filters.sortBy}
          onChange={update("sortBy")}
          options={[
            { value: "uploadedAt_desc", label: "Newest first" },
            { value: "uploadedAt_asc", label: "Oldest first" },
            { value: "name_asc", label: "Name A-Z" },
            { value: "fileSize_desc", label: "Largest first" },
            { value: "clientName_asc", label: "Client name" },
          ]}
        />
      </div>

      <button
        type="button"
        className={styles.buttonGhost}
        onClick={() =>
          onChange({
            search: "",
            category: "all",
            clientId: "all",
            therapistId: "all",
            fileType: "all",
            sortBy: "uploadedAt_desc",
          })
        }
      >
        <X size={14} /> Clear
      </button>
    </div>
  );
}
