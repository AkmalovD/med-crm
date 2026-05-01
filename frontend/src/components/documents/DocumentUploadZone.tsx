interface DocumentUploadZoneProps {
  onOpenUpload: () => void;
}

export function DocumentUploadZone({ onOpenUpload }: DocumentUploadZoneProps) {
  return (
    <div className="rounded-[0.8rem] border-2 border-dashed border-[#cbd5e1] bg-white p-4 text-center">
      <p className="m-0 mt-[0.4rem] text-[0.85rem] font-bold">Drop files here</p>
      <p className="m-0 mt-[0.25rem] text-[0.72rem] text-[#64748b]">Supported: PDF, JPG, PNG, DOCX (max 20MB per file)</p>
      <button
        type="button"
        className="mx-auto mt-[0.7rem] flex w-fit min-w-[9rem] items-center justify-center gap-1.5 rounded-[0.55rem] border border-[#dbe3ef] bg-[#f8fafc] px-[0.65rem] py-2 text-[0.82rem] font-semibold text-[#0f172a]"
        onClick={onOpenUpload}
      >
        Browse Files
      </button>
    </div>
  );
}
