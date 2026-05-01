import { DocumentItem } from "./Documents.types";
import { DocumentCard } from "./DocumentCard";

interface DocumentsGridProps {
  documents: DocumentItem[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onPreview: (id: string) => void;
  onDownload: (id: string) => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export function DocumentsGrid({
  documents,
  selectedIds,
  onToggleSelect,
  onPreview,
  onDownload,
  onRename,
  onDelete,
}: DocumentsGridProps) {
  return (
    <section className="grid grid-cols-2 gap-[0.8rem] min-[900px]:grid-cols-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          selected={selectedIds.has(document.id)}
          onToggleSelect={onToggleSelect}
          onPreview={onPreview}
          onDownload={onDownload}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
}
