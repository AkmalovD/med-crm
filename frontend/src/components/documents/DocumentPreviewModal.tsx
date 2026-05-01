import { Download, Pencil } from "lucide-react";

import { DocumentItem } from "./Documents.types";
import { FILE_TYPE_LABELS, formatFileSize } from "./Documents.utils";

interface DocumentPreviewModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload: (id: string) => void;
  onRename: (id: string) => void;
}

export function DocumentPreviewModal({ document, isOpen, onClose, onDownload, onRename }: DocumentPreviewModalProps) {
  if (!isOpen || !document) return null;

  const buttonBase =
    "flex items-center justify-center gap-1.5 rounded-[0.55rem] border px-[0.65rem] py-2 text-[0.82rem] font-semibold";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(15,23,42,0.45)] p-4">
      <div className="flex w-[min(64rem,95vw)] flex-col gap-[0.7rem] rounded-[0.9rem] border border-[#dbe3ef] bg-white p-[0.95rem] shadow-[0_22px_44px_rgba(15,23,42,0.2)]">
        <div className="flex items-center justify-between gap-[0.6rem]">
          <div>
            <h3 className="m-0 text-[1rem]">{document.name}</h3>
            <p className="m-0 mt-[0.2rem] text-[0.78rem] text-[#64748b]">
              {document.client?.fullName ?? "No client"} - {formatFileSize(document.fileSize)} -{" "}
              {FILE_TYPE_LABELS[document.fileType]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`${buttonBase} border-[#dbe3ef] bg-white text-[#0f172a]`}
              onClick={() => onRename(document.id)}
            >
              <Pencil size={14} /> Rename
            </button>
            <button
              type="button"
              className={`${buttonBase} border-[#4acf7f] bg-[#4acf7f] text-white`}
              onClick={() => onDownload(document.id)}
            >
              <Download size={14} /> Download
            </button>
            <button type="button" className={`${buttonBase} border-[#dbe3ef] bg-[#f8fafc] text-[#0f172a]`} onClick={onClose}>
              Close
            </button>
          </div>
        </div>

        {document.fileType === "pdf" && (
          <div className="h-[68vh] overflow-hidden rounded-[0.7rem] border border-[#e2e8f0] bg-[#f8fafc]">
            <iframe src={document.fileUrl} title={document.name} style={{ width: "100%", height: "100%" }} />
          </div>
        )}

        {(document.fileType === "jpg" || document.fileType === "png") && (
          <div className="h-[68vh] overflow-hidden rounded-[0.7rem] border border-[#e2e8f0] bg-[#f8fafc]">
            <img
              src={document.fileUrl}
              alt={document.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        )}

        {document.fileType === "docx" && (
          <div className="grid h-[68vh] place-items-center text-[#64748b]">
            Word documents cannot be previewed in browser. Use download to view.
          </div>
        )}
      </div>
    </div>
  );
}
