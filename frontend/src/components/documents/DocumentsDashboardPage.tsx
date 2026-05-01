"use client";

import { useMemo, useState } from "react";

import { DashboardScaffold } from "../dashboard/DashboardScaffold";
import { AUDIT_LOGS_MOCK, DOCUMENTS_MOCK } from "./Documents.mock";
import { BulkActionsBar } from "./BulkActionsBar";
import { DocumentAuditModal } from "./DocumentAuditModal";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import { DocumentRenameModal } from "./DocumentRenameModal";
import { DocumentUploadModal } from "./DocumentUploadModal";
import { DocumentUploadZone } from "./DocumentUploadZone";
import { DocumentsFilterBar } from "./DocumentsFilterBar";
import { DocumentsGrid } from "./DocumentsGrid";
import { DocumentsHeader } from "./DocumentsHeader";
import { DocumentsTable } from "./DocumentsTable";
import { DocumentsViewToggle } from "./DocumentsViewToggle";
import { DocumentFiltersState, DocumentItem, ViewMode } from "./Documents.types";
import { compareDocuments } from "./Documents.utils";

const INITIAL_FILTERS: DocumentFiltersState = {
  search: "",
  category: "all",
  clientId: "all",
  therapistId: "all",
  fileType: "all",
  sortBy: "uploadedAt_desc",
};

export function DocumentsDashboardPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(DOCUMENTS_MOCK);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [filters, setFilters] = useState<DocumentFiltersState>(INITIAL_FILTERS);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);

  const activeDocument = useMemo(
    () => documents.find((item) => item.id === activeDocumentId) ?? null,
    [activeDocumentId, documents],
  );

  const clientOptions = useMemo(
    () =>
      Array.from(new Set(documents.map((item) => item.client?.id).filter(Boolean))).map((id) => ({
        value: id as string,
        label: documents.find((item) => item.client?.id === id)?.client?.fullName ?? "Unknown",
      })),
    [documents],
  );

  const therapistOptions = useMemo(
    () =>
      Array.from(new Set(documents.map((item) => item.therapist?.id).filter(Boolean))).map((id) => ({
        value: id as string,
        label: documents.find((item) => item.therapist?.id === id)?.therapist?.fullName ?? "Unknown",
      })),
    [documents],
  );

  const visibleDocuments = useMemo(() => {
    return documents
      .filter((item) => {
        const searchText = `${item.name} ${item.client?.fullName ?? ""}`.toLowerCase();
        const bySearch = !filters.search || searchText.includes(filters.search.toLowerCase());
        const byCategory = filters.category === "all" || item.category === filters.category;
        const byClient = filters.clientId === "all" || item.client?.id === filters.clientId;
        const byTherapist = filters.therapistId === "all" || item.therapist?.id === filters.therapistId;
        const byType = filters.fileType === "all" || item.fileType === filters.fileType;
        return bySearch && byCategory && byClient && byTherapist && byType;
      })
      .sort((left, right) => compareDocuments(left, right, filters.sortBy));
  }, [documents, filters]);

  const toggleSelect = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = (ids: string[]) => setSelectedIds(new Set(ids));

  const openPreview = (id: string) => {
    setActiveDocumentId(id);
    setIsPreviewOpen(true);
  };

  const openRename = (id: string) => {
    setActiveDocumentId(id);
    setIsRenameOpen(true);
  };

  const openAudit = (id: string) => {
    setActiveDocumentId(id);
    setIsAuditOpen(true);
  };

  const deleteOne = (id: string) => {
    setDocuments((current) => current.filter((item) => item.id !== id));
    setSelectedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  };

  const deleteBulk = () => {
    setDocuments((current) => current.filter((item) => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
  };

  return (
    <DashboardScaffold>
      <div className="flex min-h-full flex-col gap-4 bg-[linear-gradient(180deg,#f8fafc_0%,#f5f7fb_100%)] p-6">
        <DocumentsHeader
          selectedCount={selectedIds.size}
          onUpload={() => setIsUploadOpen(true)}
          onBulkDownload={() => alert("Bulk download started")}
        />

        <DocumentsFilterBar
          filters={filters}
          clientOptions={clientOptions}
          therapistOptions={therapistOptions}
          onChange={setFilters}
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <DocumentsViewToggle viewMode={viewMode} onChange={setViewMode} />
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-[0.55rem] border border-[#dbe3ef] bg-white px-[0.65rem] py-2 text-[0.82rem] font-semibold text-[#0f172a] disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => activeDocumentId && openAudit(activeDocumentId)}
            disabled={!activeDocumentId}
          >
            View Audit Log
          </button>
        </div>

        <DocumentUploadZone onOpenUpload={() => setIsUploadOpen(true)} />

        {viewMode === "grid" ? (
          <DocumentsGrid
            documents={visibleDocuments}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onPreview={openPreview}
            onDownload={() => alert("Download started")}
            onRename={openRename}
            onDelete={deleteOne}
          />
        ) : (
          <DocumentsTable
            documents={visibleDocuments}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
            onSelectAll={selectAll}
            onPreview={openPreview}
            onDownload={() => alert("Download started")}
            onRename={openRename}
            onDelete={deleteOne}
          />
        )}
      </div>

      <BulkActionsBar
        selectedCount={selectedIds.size}
        onClear={() => setSelectedIds(new Set())}
        onBulkDownload={() => alert("Bulk download started")}
        onBulkDelete={deleteBulk}
      />

      <DocumentUploadModal
        isOpen={isUploadOpen}
        pendingFileNames={["sample-referral.pdf", "progress-note.docx"]}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={(payload) => {
          setIsUploadOpen(false);
          const now = new Date().toISOString();
          const generated: DocumentItem = {
            id: `doc-${Date.now()}`,
            name: `New Upload (${payload.category})`,
            originalName: "uploaded-file.pdf",
            fileType: "pdf",
            fileSize: 550000,
            fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            thumbnailUrl: null,
            category: payload.category as DocumentItem["category"],
            tags: payload.tags,
            isConfidential: payload.isConfidential,
            client: null,
            therapist: null,
            uploadedByName: "Current User",
            uploadedAt: now,
            updatedAt: now,
          };
          setDocuments((current) => [generated, ...current]);
        }}
      />

      <DocumentPreviewModal
        document={activeDocument}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={() => alert("Download started")}
        onRename={(id) => {
          setIsPreviewOpen(false);
          openRename(id);
        }}
      />

      <DocumentRenameModal
        document={activeDocument}
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        onSubmit={(id, name) => {
          setDocuments((current) => current.map((item) => (item.id === id ? { ...item, name } : item)));
          setIsRenameOpen(false);
        }}
      />

      <DocumentAuditModal
        document={activeDocument}
        isOpen={isAuditOpen}
        auditEntries={AUDIT_LOGS_MOCK}
        onClose={() => setIsAuditOpen(false)}
      />
    </DashboardScaffold>
  );
}
