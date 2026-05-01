import { LayoutGrid, List } from "lucide-react";

import { ViewMode } from "./Documents.types";

interface DocumentsViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function DocumentsViewToggle({ viewMode, onChange }: DocumentsViewToggleProps) {
  const baseButton =
    "flex items-center justify-center gap-1.5 rounded-[0.55rem] border border-[#dbe3ef] bg-white px-[0.65rem] py-2 text-[0.82rem] font-semibold text-[#0f172a]";
  const activeButton = "border-[#4acf7f] bg-[#4acf7f] text-white";

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className={`${baseButton} ${viewMode === "grid" ? activeButton : ""}`}
        onClick={() => onChange("grid")}
      >
        <LayoutGrid size={14} /> Grid
      </button>
      <button
        type="button"
        className={`${baseButton} ${viewMode === "list" ? activeButton : ""}`}
        onClick={() => onChange("list")}
      >
        <List size={14} /> List
      </button>
    </div>
  );
}
