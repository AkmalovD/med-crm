import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./TherapistsDashboardPage.module.css";
import { Therapist, TherapistStatus } from "@/types/therapistsDashboardTypes";
import { EMPLOYMENT_LABELS, PAGE_SIZE, SPECIALIZATION_LABELS, STATUS_LABELS } from "@/data/therapistsData/therapistsDashboardData";
import { cx, formatDate, relativeTime } from "@/utils/therapistsDashboardUtils";

interface TherapistsTableCardProps {
  paginated: Therapist[];
  safePage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

function StatusBadge({ status }: { status: TherapistStatus }) {
  return <span className={cx(styles.statusBadge, styles[`status_${status}`])}>{STATUS_LABELS[status]}</span>;
}

export function TherapistsTableCard({
  paginated,
  safePage,
  totalPages,
  onPreviousPage,
  onNextPage,
}: TherapistsTableCardProps) {
  const router = useRouter();

  return (
    <section className={styles.tableCard}>
      <div className="overflow-x-auto">
        <table className={styles.therapistsTable}>
          <thead>
            <tr>
              <th>Therapist</th>
              <th>Specializations</th>
              <th>Employment</th>
              <th>Clients</th>
              <th>Join Date</th>
              <th>Last Login</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className={styles.emptyState}>
                    <p className="text-lg font-semibold text-slate-700">No therapists found</p>
                    <p className="mt-1 text-sm text-slate-500">Try changing filters or invite your first therapist.</p>
                    <button type="button" className={styles.primaryButton}>
                      Invite your first therapist
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {paginated.map((therapist, index) => {
              const utilization = Math.round(
                (therapist.currentClientCount / Math.max(1, therapist.maxClientsCapacity)) * 100,
              );
              return (
                <tr
                  key={therapist.id}
                  className={cx(styles.tableRow, index % 2 === 0 && styles.alternateRow)}
                  onClick={() => router.push(`/therapists/${therapist.id}`)}
                >
                  <td>
                    <div className={styles.therapistCell}>
                      <span className={styles.avatar}>
                        {therapist.firstName[0]}
                        {therapist.lastName[0]}
                      </span>
                      <div>
                        <p className="font-semibold text-[#1a1a2e]">{therapist.fullName}</p>
                        <p className="text-xs text-slate-500">{therapist.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.specializationsWrap}>
                      {therapist.specializations.slice(0, 2).map((specialization) => (
                        <span key={specialization} className={styles.specializationBadge}>
                          {SPECIALIZATION_LABELS[specialization]}
                        </span>
                      ))}
                      {therapist.specializations.length > 2 && (
                        <span className={styles.overflowBadge}>+{therapist.specializations.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={styles.employmentBadge}>
                      {EMPLOYMENT_LABELS[therapist.employmentType]}
                    </span>
                  </td>
                  <td>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {therapist.currentClientCount}/{therapist.maxClientsCapacity}
                      </p>
                      <div className={styles.capacityBar}>
                        <span style={{ width: `${Math.min(100, utilization)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td>{formatDate(therapist.joinDate)}</td>
                  <td>{relativeTime(therapist.lastLoginAt)}</td>
                  <td>
                    <StatusBadge status={therapist.status} />
                  </td>
                  <td onClick={(event) => event.stopPropagation()}>
                    <div className={styles.actionsCell}>
                      <button type="button" className={styles.rowButton} onClick={() => router.push(`/therapists/${therapist.id}`)}>
                        View
                      </button>
                      <button type="button" className={styles.rowButton}>
                        Edit
                      </button>
                      <button type="button" className={styles.rowButtonIcon} aria-label="More actions">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className={styles.tableFooter}>
        <span>Rows per page: {PAGE_SIZE}</span>
        <button type="button" className={styles.pagerButton} disabled={safePage <= 1} onClick={onPreviousPage}>
          Previous
        </button>
        <span>
          {safePage} / {totalPages}
        </span>
        <button type="button" className={styles.pagerButton} disabled={safePage >= totalPages} onClick={onNextPage}>
          Next
        </button>
      </footer>
    </section>
  );
}

