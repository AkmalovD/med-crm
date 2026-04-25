import { AppointmentStatus } from "@/types/appointmentsDashboardTypes";
import { STATUS_CLASS, STATUS_LABELS } from "@/data/appointmentsData/appointmentsDashboardData";
import { cx } from "@/utils/appointmentsDashboardUtils";

export function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={cx(
        "whitespace-nowrap rounded-full px-[0.46rem] py-[0.18rem] text-[0.7rem] font-bold",
        STATUS_CLASS[status],
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
