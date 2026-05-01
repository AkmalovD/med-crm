import { AuditLogEntry, DocumentItem } from "./Documents.types";
import { AUDIT_ACTION_LABELS } from "./Documents.utils";

interface DocumentAuditModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  auditEntries: AuditLogEntry[];
  onClose: () => void;
}

export function DocumentAuditModal({ document, isOpen, auditEntries, onClose }: DocumentAuditModalProps) {
  if (!isOpen || !document) return null;

  const rows = auditEntries.filter((item) => item.documentId === document.id);
  const buttonClass =
    "flex items-center justify-center gap-1.5 rounded-[0.55rem] border border-[#dbe3ef] bg-[#f8fafc] px-[0.65rem] py-2 text-[0.82rem] font-semibold text-[#0f172a]";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(15,23,42,0.45)] p-4">
      <div className="flex w-[min(42rem,95vw)] flex-col gap-[0.7rem] rounded-[0.9rem] border border-[#dbe3ef] bg-white p-[0.95rem] shadow-[0_22px_44px_rgba(15,23,42,0.2)]">
        <div className="flex items-center justify-between gap-[0.6rem]">
          <div>
            <h3 className="m-0 text-[1rem]">{document.name}</h3>
            <p className="m-0 mt-[0.2rem] text-[0.78rem] text-[#64748b]">Audit log</p>
          </div>
          <button type="button" className={buttonClass} onClick={onClose}>
            Close
          </button>
        </div>
        <div className="flex flex-col gap-[0.6rem]">
          {rows.length === 0 ? <p className="m-0 mt-[0.2rem] text-[0.78rem] text-[#64748b]">No audit activity yet.</p> : null}
          <ul className="m-0 flex list-none flex-col gap-[0.4rem] p-0">
            {rows.map((entry) => (
              <li key={entry.id} className="border-b border-[#e2e8f0] pb-[0.45rem] last:border-b-0">
                <strong>{entry.performedByName}</strong> {AUDIT_ACTION_LABELS[entry.action]}
                {entry.meta ? ` (${Object.entries(entry.meta).map(([k, v]) => `${k}: ${v}`).join(", ")})` : ""}
                <div className="m-0 mt-[0.2rem] text-[0.78rem] text-[#64748b]">{new Date(entry.performedAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
