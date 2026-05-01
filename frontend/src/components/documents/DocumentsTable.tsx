import { Download, Eye, Lock, Pencil, Trash2 } from "lucide-react";

import { CATEGORY_LABELS, FILE_TYPE_LABELS, formatDate, formatFileSize } from "./Documents.utils";
import { DocumentItem } from "./Documents.types";

interface DocumentsTableProps {
  documents: DocumentItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DocumentsTable({
  documents,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}: DocumentsTableProps) {
  const allSelected = documents.length > 0 && documents.every((item) => selectedIds.has(item.id));
  const buttonClass =
    "flex items-center justify-center gap-1.5 rounded-[0.55rem] border border-[#dbe3ef] bg-white px-[0.65rem] py-2 text-[0.82rem] font-semibold text-[#0f172a]";

  return (
    <section className="overflow-x-auto rounded-[0.9rem] border border-[#e2e8f0] bg-white">
      <table className="min-w-[900px] w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.7rem] uppercase text-[#64748b]">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onSelectAll(allSelected ? [] : documents.map((item) => item.id))}
              />
            </th>
            <th className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.7rem] uppercase text-[#64748b]">Name</th>
            <th className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.7rem] uppercase text-[#64748b]">
              Category
            </th>
            <th className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.7rem] uppercase text-[#64748b]">Client</th>
            <th className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.7rem] uppercase text-[#64748b]">
              Therapist
            </th>
            <th className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.7rem] uppercase text-[#64748b]">Type</th>
            <th className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.7rem] uppercase text-[#64748b]">Size</th>
            <th className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.7rem] uppercase text-[#64748b]">
              Uploaded
            </th>
            <th className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.7rem] uppercase text-[#64748b]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((document) => (
            <tr key={document.id} className="even:bg-[#f8fafc] hover:bg-[#f0fdf4]">
              <td className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.77rem]">
                <input
                  type="checkbox"
                  checked={selectedIds.has(document.id)}
                  onChange={() => onToggleSelect(document.id)}
                />
              </td>
              <td className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.77rem]">
                {document.name} {document.isConfidential && <Lock size={12} />}
              </td>
              <td className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.77rem]">{CATEGORY_LABELS[document.category]}</td>
              <td className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.77rem]">
                {document.client?.fullName ?? "No client"}
              </td>
              <td className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.77rem]">
                {document.therapist?.fullName ?? "Unassigned"}
              </td>
              <td className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.77rem]">{FILE_TYPE_LABELS[document.fileType]}</td>
              <td className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.77rem]">{formatFileSize(document.fileSize)}</td>
              <td className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.77rem]">{formatDate(document.uploadedAt)}</td>
              <td className="border-b border-[#e2e8f0] p-[0.6rem] text-left text-[0.77rem]">
                <div className="flex items-center gap-2">
                  <button type="button" className={buttonClass} onClick={() => onPreview(document.id)}>
                    <Eye size={13} />
                  </button>
                  <button type="button" className={buttonClass} onClick={() => onDownload(document.id)}>
                    <Download size={13} />
                  </button>
                  <button type="button" className={buttonClass} onClick={() => onRename(document.id)}>
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    className={`${buttonClass} border-[#fecaca] text-[#dc2626]`}
                    onClick={() => onDelete(document.id)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
