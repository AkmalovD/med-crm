import { Download, Eye, FileText, ImageIcon, Lock, MoreHorizontal, Type } from "lucide-react";

import { CATEGORY_LABELS, FILE_TYPE_LABELS, formatDate, formatFileSize } from "./Documents.utils";
import { DocumentItem } from "./Documents.types";
import { DocumentCardActionButton } from "./DocumentCardActionButton";

interface DocumentCardProps {
  document: DocumentItem;
  selected: boolean;
  onToggleSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

function fileTypeBadgeClass(fileType: DocumentItem["fileType"]) {
  const baseClass =
    "inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold leading-none";

  if (fileType === "pdf") return `${baseClass} bg-red-50 text-red-700`;
  if (fileType === "docx") return `${baseClass} bg-indigo-50 text-indigo-700`;
  return `${baseClass} bg-blue-50 text-blue-700`;
}

function fileIcon(fileType: DocumentItem["fileType"]) {
  if (fileType === "pdf") return <FileText size={14} />;
  if (fileType === "docx") return <Type size={14} />;
  return <ImageIcon size={14} />;
}

export function DocumentCard({
  document,
  selected,
  onToggleSelect,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}: DocumentCardProps) {
  return (
    <article
      className={`flex flex-col gap-2 rounded-2xl border bg-white p-3 ${
        selected ? "border-[#4acf7f] bg-green-50 shadow-[inset_0_0_0_1px_#4acf7f]" : "border-slate-200"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={selected} onChange={() => onToggleSelect(document.id)} />
          <span className={fileTypeBadgeClass(document.fileType)}>
            {fileIcon(document.fileType)} {FILE_TYPE_LABELS[document.fileType]}
          </span>
        </label>
        {document.isConfidential && (
          <span title="Confidential" className="text-slate-600">
            <Lock size={14} aria-label="Confidential" />
          </span>
        )}
      </div>

      <p className="m-0 text-base font-bold text-slate-900">{document.name}</p>
      <p className="m-0 text-sm text-slate-600">
        {document.client?.fullName ?? "No client"} - {formatFileSize(document.fileSize)}
      </p>
      <p className="m-0 text-sm text-slate-600">{formatDate(document.uploadedAt)}</p>
      <span className="inline-flex w-fit rounded-full bg-cyan-50 px-2 py-0.5 text-[11px] font-bold text-cyan-700">
        {CATEGORY_LABELS[document.category]}
      </span>

      <div className="mt-1 flex items-center gap-2">
        <DocumentCardActionButton icon={<Eye size={14} />} label="Preview" onClick={() => onPreview(document.id)} />
        <DocumentCardActionButton
          icon={<Download size={14} />}
          label="Download"
          onClick={() => onDownload(document.id)}
        />
        <DocumentCardActionButton
          icon={<MoreHorizontal size={14} />}
          label="Rename"
          onClick={() => onRename(document.id)}
        />
        <DocumentCardActionButton label="Delete" variant="danger" onClick={() => onDelete(document.id)} />
      </div>
    </article>
  );
}
