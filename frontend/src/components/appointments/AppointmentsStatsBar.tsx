import { NUMBER } from "@/utils/appointmentsDashboardUtils";

interface AppointmentsStatsBarProps {
  totalToday: number;
  confirmedToday: number;
  pendingToday: number;
  cancelledToday: number;
  availableSlots: number;
}

export function AppointmentsStatsBar({
  totalToday,
  confirmedToday,
  pendingToday,
  cancelledToday,
  availableSlots,
}: AppointmentsStatsBarProps) {
  const statChipClass = "flex min-w-[8.1rem] flex-col gap-[0.2rem]";
  const labelClass = "text-xs text-slate-500";
  const valueClass = "text-[1.1rem] text-slate-900";

  return (
    <section className="flex flex-wrap items-center gap-[0.45rem] rounded-[0.85rem] border border-slate-200 bg-white px-[0.9rem] py-[0.65rem] max-[760px]:gap-[0.7rem]">
      <div className={statChipClass}>
        <span className={labelClass}>Total Today</span>
        <strong className={valueClass}>{NUMBER.format(totalToday)}</strong>
      </div>
      <div className="w-px self-stretch bg-slate-200 max-[760px]:hidden" />
      <div className={statChipClass}>
        <span className={labelClass}>Confirmed</span>
        <strong className="text-[1.1rem] text-[#4acf7f]">{NUMBER.format(confirmedToday)}</strong>
      </div>
      <div className="w-px self-stretch bg-slate-200 max-[760px]:hidden" />
      <div className={statChipClass}>
        <span className={labelClass}>Pending</span>
        <strong className="text-[1.1rem] text-amber-500">{NUMBER.format(pendingToday)}</strong>
      </div>
      <div className="w-px self-stretch bg-slate-200 max-[760px]:hidden" />
      <div className={statChipClass}>
        <span className={labelClass}>Cancelled</span>
        <strong className="text-[1.1rem] text-red-500">{NUMBER.format(cancelledToday)}</strong>
      </div>
      <div className="w-px self-stretch bg-slate-200 max-[760px]:hidden" />
      <div className={statChipClass}>
        <span className={labelClass}>Available Slots</span>
        <strong className="text-[1.1rem] text-blue-400">{NUMBER.format(availableSlots)}</strong>
      </div>
    </section>
  );
}
