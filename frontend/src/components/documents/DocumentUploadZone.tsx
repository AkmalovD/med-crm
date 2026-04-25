import styles from "./DocumentsDashboardPage.module.css";

interface DocumentUploadZoneProps {
  onOpenUpload: () => void;
}

export function DocumentUploadZone({ onOpenUpload }: DocumentUploadZoneProps) {
  return (
    <div className={`${styles.card} ${styles.dropzone}`}>
      <p className={styles.dropzoneTitle}>Drop files here</p>
      <p className={styles.dropzoneSub}>Supported: PDF, JPG, PNG, DOCX (max 20MB per file)</p>
      <button
        type="button"
        className={styles.buttonGhost}
        style={{ marginTop: "0.7rem", minWidth: "9rem", width: "fit-content", marginInline: "auto" }}
        onClick={onOpenUpload}
      >
        Browse Files
      </button>
    </div>
  );
}
