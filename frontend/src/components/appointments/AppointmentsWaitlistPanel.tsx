import { Users, X } from "lucide-react";
import { WaitlistEntry } from "@/types/appointmentsDashboardTypes";
import {
  SESSION_LABELS,
  TIME_RANGE_LABELS,
} from "@/data/appointmentsData/appointmentsDashboardData";

interface AppointmentsWaitlistPanelProps {
  waitlist: WaitlistEntry[];
  onConvert: (entry: WaitlistEntry) => void;
  onRemove: (id: string) => void;
}

export function AppointmentsWaitlistPanel({
  waitlist,
  onConvert,
  onRemove,
}: AppointmentsWaitlistPanelProps) {
  const secondaryButtonClass =
    "rounded-[0.55rem] border border-[#d8dde8] bg-white px-3 py-[0.55rem] text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";
  const iconButtonClass =
    "inline-flex min-h-8 min-w-8 items-center justify-center rounded-[0.55rem] border border-[#d8dde8] bg-white p-2 text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";

  return (
    <aside className="flex max-h-[40rem] flex-col rounded-[0.9rem] border border-slate-200 bg-white max-[1320px]:max-h-[18rem]">
      <header className="flex items-center justify-between border-b border-slate-200 p-[0.8rem]">
        <h2 className="inline-flex items-center gap-[0.35rem] text-[0.9rem] text-slate-800">
          <Users size={16} />
          Waitlist
        </h2>
        <span className="rounded-full bg-emerald-50 px-[0.45rem] py-[0.18rem] text-[0.75rem] font-bold text-green-700">
          {waitlist.length}
        </span>
      </header>
      <div className="flex flex-col gap-[0.6rem] overflow-y-auto p-3">
        {waitlist.length === 0 && <p className="p-4 text-center text-[0.85rem] text-slate-400">No clients on waitlist.</p>}
        {waitlist.map((entry) => (
          <article key={entry.id} className="flex flex-col gap-[0.35rem] rounded-[0.75rem] border border-slate-200 p-[0.6rem]">
            <p className="text-[0.82rem] font-bold text-slate-900">{entry.client.fullName}</p>
            <p className="text-[0.73rem] text-slate-500">{entry.client.phone}</p>
            <p className="text-[0.73rem] text-slate-500">
              {entry.preferredDays.join(", ")} | {TIME_RANGE_LABELS[entry.preferredTimeRange]}
            </p>
            <p className="text-[0.73rem] text-slate-500">Session: {SESSION_LABELS[entry.sessionType]}</p>
            <div className="mt-[0.2rem] flex gap-[0.4rem]">
              <button type="button" className={secondaryButtonClass} onClick={() => onConvert(entry)}>
                Convert
              </button>
              <button type="button" className={iconButtonClass} onClick={() => onRemove(entry.id)} aria-label="Remove entry">
                <X size={14} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
