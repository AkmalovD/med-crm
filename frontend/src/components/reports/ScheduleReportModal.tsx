import { REPORT_TYPE_LABEL } from "@/data/reportsData/reportsDashboardData";
import { ExportFormat, ReportType, ScheduleFrequency } from "@/types/reportsDashboardTypes";
import { DropdownSelect } from "../custom-ui/dropdown";
import styles from "./ReportsDashboardPage.module.css";

interface ScheduleReportModalProps {
  editingScheduleId: string | null;
  scheduleName: string;
  scheduleType: ReportType;
  scheduleFrequency: ScheduleFrequency;
  scheduleFormat: ExportFormat;
  scheduleRecipients: string;
  onScheduleNameChange: (value: string) => void;
  onScheduleTypeChange: (value: ReportType) => void;
  onScheduleFrequencyChange: (value: ScheduleFrequency) => void;
  onScheduleFormatChange: (value: ExportFormat) => void;
  onScheduleRecipientsChange: (value: string) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export function ScheduleReportModal(props: ScheduleReportModalProps) {
  const {
    editingScheduleId,
    scheduleName,
    scheduleType,
    scheduleFrequency,
    scheduleFormat,
    scheduleRecipients,
    onScheduleNameChange,
    onScheduleTypeChange,
    onScheduleFrequencyChange,
    onScheduleFormatChange,
    onScheduleRecipientsChange,
    onClose,
    onSubmit,
  } = props;

  return (
    <div className={styles.modalOverlay}>
      <form className={styles.modal} onSubmit={onSubmit}>
        <h3>{editingScheduleId ? "Edit Schedule" : "Create Schedule"}</h3>
        <label className={styles.field}>
          <span>Schedule Name</span>
          <input className={styles.input} value={scheduleName} onChange={(e) => onScheduleNameChange(e.target.value)} required />
        </label>
        <label className={styles.field}>
          <span>Report Type</span>
          <DropdownSelect
            triggerClassName={styles.select}
            value={scheduleType}
            onChange={(e) => onScheduleTypeChange(e.target.value as ReportType)}
            options={(Object.keys(REPORT_TYPE_LABEL) as ReportType[]).map((type) => ({
              value: type,
              label: REPORT_TYPE_LABEL[type],
            }))}
          />
        </label>
        <div className={styles.twoColumns}>
          <label className={styles.field}>
            <span>Frequency</span>
            <DropdownSelect
              triggerClassName={styles.select}
              value={scheduleFrequency}
              onChange={(e) => onScheduleFrequencyChange(e.target.value as ScheduleFrequency)}
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
                { value: "monthly", label: "Monthly" },
              ]}
            />
          </label>
          <label className={styles.field}>
            <span>Export Format</span>
            <DropdownSelect
              triggerClassName={styles.select}
              value={scheduleFormat}
              onChange={(e) => onScheduleFormatChange(e.target.value as ExportFormat)}
              options={[
                { value: "pdf", label: "PDF" },
                { value: "excel", label: "Excel" },
                { value: "csv", label: "CSV" },
              ]}
            />
          </label>
        </div>
        <label className={styles.field}>
          <span>Recipients (comma separated emails)</span>
          <input className={styles.input} value={scheduleRecipients} onChange={(e) => onScheduleRecipientsChange(e.target.value)} required />
        </label>
        <div className={styles.rowEnd}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={styles.primaryButton}>
            {editingScheduleId ? "Save Changes" : "Create Schedule"}
          </button>
        </div>
      </form>
    </div>
  );
}
