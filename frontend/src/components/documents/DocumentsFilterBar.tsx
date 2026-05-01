import { X } from "lucide-react";
import { DropdownSelect } from "../custom-ui/dropdown";

import { DocumentCategory, DocumentFiltersState } from "./Documents.types";

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
  const fieldClass =
    "flex items-center justify-center gap-1.5 rounded-[0.55rem] border border-[#dbe3ef] bg-white px-[0.65rem] py-2 text-[0.82rem] font-semibold text-[#0f172a]";

  const update = (key: keyof DocumentFiltersState) => (event: { target: { value: string } }) => {
    onChange({ ...filters, [key]: event.target.value });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[0.9rem] border border-[#e2e8f0] bg-white p-3">
      <div className="flex items-center gap-2">
        <input
          className={`${fieldClass} min-w-[14rem]`}
          placeholder="Search by name or client..."
          value={filters.search}
          onChange={update("search")}
        />
        <DropdownSelect
          triggerClassName={fieldClass}
          value={filters.category}
          onChange={update("category")}
          options={CATEGORY_OPTIONS.map((item) => ({ value: item.value, label: item.label }))}
        />
        <DropdownSelect
          triggerClassName={fieldClass}
          value={filters.clientId}
          onChange={update("clientId")}
          options={[{ value: "all", label: "All Clients" }, ...clientOptions]}
        />
        <DropdownSelect
          triggerClassName={fieldClass}
          value={filters.therapistId}
          onChange={update("therapistId")}
          options={[{ value: "all", label: "All Therapists" }, ...therapistOptions]}
        />
        <DropdownSelect
          triggerClassName={fieldClass}
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
          triggerClassName={fieldClass}
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
        className={`${fieldClass} bg-[#f8fafc]`}
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
