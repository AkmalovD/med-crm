import { FormEvent, useEffect, useState } from "react";

import { DocumentItem } from "./Documents.types";

interface DocumentRenameModalProps {
  document: DocumentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, name: string) => void;
}

export function DocumentRenameModal({ document, isOpen, onClose, onSubmit }: DocumentRenameModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(document?.name ?? "");
  }, [document]);

  if (!isOpen || !document) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit(document.id, name.trim());
  };

  const fieldClass =
    "flex items-center justify-center gap-1.5 rounded-[0.55rem] border border-[#dbe3ef] bg-white px-[0.65rem] py-2 text-[0.82rem] font-semibold text-[#0f172a]";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(15,23,42,0.45)] p-4">
      <div className="flex w-[min(42rem,95vw)] flex-col gap-[0.7rem] rounded-[0.9rem] border border-[#dbe3ef] bg-white p-[0.95rem] shadow-[0_22px_44px_rgba(15,23,42,0.2)]">
        <div className="flex items-center justify-between gap-[0.6rem]">
          <h3 className="m-0 text-[1rem]">Rename document</h3>
          <button type="button" className={`${fieldClass} bg-[#f8fafc]`} onClick={onClose}>
            Close
          </button>
        </div>
        <form className="flex flex-col gap-[0.6rem]" onSubmit={handleSubmit}>
          <input
            className={`${fieldClass} min-w-[14rem]`}
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter document name"
            autoFocus
          />
          <div className="flex items-center justify-between gap-2">
            <button type="button" className={`${fieldClass} bg-[#f8fafc]`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${fieldClass} border-[#4acf7f] bg-[#4acf7f] text-white`}>
              Save name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
