import { ReactNode } from "react";

interface DocumentCardActionButtonProps {
  icon?: ReactNode;
  label?: string;
  onClick: () => void;
  variant?: "icon" | "danger";
}

export function DocumentCardActionButton({
  icon,
  label,
  onClick,
  variant = "icon",
}: DocumentCardActionButtonProps) {
  if (variant === "danger") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex h-9 items-center justify-center rounded-xl border border-red-200 px-4 text-base font-semibold text-red-600 transition-colors hover:bg-red-50"
      >
        {label ?? "Delete"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50"
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
