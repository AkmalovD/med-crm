import { Archive, Upload } from "lucide-react";

interface DocumentsHeaderProps {
  selectedCount: number;
  onUpload: () => void;
  onBulkDownload: () => void;
}

export function DocumentsHeader({ selectedCount, onUpload, onBulkDownload }: DocumentsHeaderProps) {
  const buttonBase =
    "flex items-center justify-center gap-1.5 rounded-[0.55rem] border px-[0.65rem] py-2 text-[0.82rem] font-semibold";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="m-0 text-[1.7rem] text-[#0f172a]">Documents</h1>
        <p className="m-0 mt-[0.2rem] text-[0.85rem] text-[#64748b]">Manage client records, referrals, and reports.</p>
      </div>

      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <button
            type="button"
            className={`${buttonBase} border-[#dbe3ef] bg-white text-[#0f172a]`}
            onClick={onBulkDownload}
          >
            <Archive size={14} /> Download ZIP ({selectedCount})
          </button>
        )}
        <button type="button" className={`${buttonBase} border-[#4acf7f] bg-[#4acf7f] text-white`} onClick={onUpload}>
          <Upload size={14} /> Upload Documents
        </button>
      </div>
    </div>
  );
}
