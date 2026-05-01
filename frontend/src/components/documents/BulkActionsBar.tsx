import { Archive, Trash2, X } from "lucide-react";

interface BulkActionsBarProps {
  selectedCount: number;
  onClear: () => void;
  onBulkDownload: () => void;
  onBulkDelete: () => void;
}

export function BulkActionsBar({
  selectedCount,
  onClear,
  onBulkDownload,
  onBulkDelete,
}: BulkActionsBarProps) {
  if (!selectedCount) return null;

  const buttonBase =
    "flex items-center justify-center gap-1.5 rounded-[0.55rem] border px-[0.65rem] py-2 text-[0.82rem] font-semibold";

  return (
    <div className="fixed bottom-4 left-[17rem] right-4 z-50 flex justify-between gap-[0.7rem] rounded-[0.75rem] border border-[#dbe3ef] bg-white px-[0.8rem] py-[0.6rem] max-[1200px]:left-4">
      <div className="flex items-center gap-2">
        <button type="button" className={`${buttonBase} border-[#dbe3ef] bg-[#f8fafc] text-[#0f172a]`} onClick={onClear}>
          <X size={14} /> Deselect all
        </button>
        <span>{selectedCount} document(s) selected</span>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className={`${buttonBase} border-[#dbe3ef] bg-white text-[#0f172a]`} onClick={onBulkDownload}>
          <Archive size={14} /> Download ZIP
        </button>
        <button type="button" className={`${buttonBase} border-[#fecaca] bg-white text-[#dc2626]`} onClick={onBulkDelete}>
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </div>
  );
}
