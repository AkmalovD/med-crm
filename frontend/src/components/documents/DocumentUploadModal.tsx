import { FormEvent, useMemo, useState } from "react";

import { DropdownSelect } from "../custom-ui/dropdown";

interface DocumentUploadModalProps {
  isOpen: boolean;
  pendingFileNames: string[];
  onClose: () => void;
  onSubmit: (payload: { category: string; tags: string[]; isConfidential: boolean }) => void;
}

export function DocumentUploadModal({ isOpen, pendingFileNames, onClose, onSubmit }: DocumentUploadModalProps) {
  const [category, setCategory] = useState("other");
  const [tags, setTags] = useState("");
  const [isConfidential, setIsConfidential] = useState(false);

  const normalizedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    [tags],
  );

  if (!isOpen) return null;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ category, tags: normalizedTags, isConfidential });
    setTags("");
    setCategory("other");
    setIsConfidential(false);
  };

  const fieldClass =
    "flex items-center justify-center gap-1.5 rounded-[0.55rem] border border-[#dbe3ef] bg-white px-[0.65rem] py-2 text-[0.82rem] font-semibold text-[#0f172a]";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-[rgba(15,23,42,0.45)] p-4">
      <div className="flex w-[min(42rem,95vw)] flex-col gap-[0.7rem] rounded-[0.9rem] border border-[#dbe3ef] bg-white p-[0.95rem] shadow-[0_22px_44px_rgba(15,23,42,0.2)]">
        <div className="flex items-center justify-between gap-[0.6rem]">
          <h3 className="m-0 text-[1rem]">Upload documents</h3>
          <button type="button" className={fieldClass} onClick={onClose}>
            Close
          </button>
        </div>

        <form className="flex flex-col gap-[0.6rem]" onSubmit={handleSubmit}>
          <ul className="m-0 flex list-none flex-col gap-[0.4rem] p-0">
            {pendingFileNames.length === 0 ? <li>No files selected yet.</li> : null}
            {pendingFileNames.map((fileName) => (
              <li key={fileName} className="flex items-center justify-between gap-2">
                <span>{fileName}</span>
                <span>Ready</span>
              </li>
            ))}
          </ul>

          <label className="flex items-center justify-between gap-2">
            Category
            <DropdownSelect
              triggerClassName={fieldClass}
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              options={[
                { value: "referral", label: "Referral" },
                { value: "assessment", label: "Assessment" },
                { value: "consent_form", label: "Consent Form" },
                { value: "progress_report", label: "Progress Report" },
                { value: "invoice", label: "Invoice" },
                { value: "other", label: "Other" },
              ]}
            />
          </label>

          <label className="flex items-center justify-between gap-2">
            Tags
            <input
              className={`${fieldClass} min-w-[14rem]`}
              placeholder="urgent, billing, signed"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </label>

          <label className="flex items-center justify-between gap-2">
            Confidential
            <input
              type="checkbox"
              checked={isConfidential}
              onChange={(event) => setIsConfidential(event.target.checked)}
            />
          </label>

          <div className="flex items-center justify-between gap-2">
            <button type="button" className={`${fieldClass} bg-[#f8fafc]`} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${fieldClass} border-[#4acf7f] bg-[#4acf7f] text-white`}>
              Upload {pendingFileNames.length || ""} file(s)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
