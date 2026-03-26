import { UserPlus } from "lucide-react";
import styles from "./TherapistsDashboardPage.module.css";

interface TherapistsPageHeaderProps {
  totalTherapists: string;
}

export function TherapistsPageHeader({ totalTherapists }: TherapistsPageHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <div className="flex items-center gap-3">
        <h1 className="text-4xl font-bold text-[#1a1a2e]">Therapists</h1>
        <span className={styles.totalBadge}>{totalTherapists} therapists</span>
      </div>
      <button type="button" className={styles.primaryButton}>
        <UserPlus size={16} />
        Invite Therapist
      </button>
    </header>
  );
}

