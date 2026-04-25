import { CalendarClock } from "lucide-react";
import { Therapist } from "@/types/appointmentsDashboardTypes";

interface AvailabilityItem {
  therapist: Therapist;
  booked: number;
  capacity: number;
  free: number;
  fill: number;
}

interface AppointmentsAvailabilitySectionProps {
  availability: AvailabilityItem[];
  onBlockSlot: (therapistId: string) => void;
}

export function AppointmentsAvailabilitySection({
  availability,
  onBlockSlot,
}: AppointmentsAvailabilitySectionProps) {
  const secondaryButtonClass =
    "rounded-[0.55rem] border border-[#d8dde8] bg-white px-3 py-[0.55rem] text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";

  return (
    <section className="rounded-[0.9rem] border border-slate-200 bg-white p-[0.9rem]">
      <header>
        <h2 className="inline-flex items-center gap-[0.42rem] text-[0.95rem] text-slate-800">
          <CalendarClock size={16} />
          Therapist Availability
        </h2>
      </header>
      <div className="mt-3 grid grid-cols-4 gap-[0.6rem] max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
        {availability.map((item) => (
          <article key={item.therapist.id} className="flex flex-col gap-[0.45rem] rounded-[0.8rem] border border-slate-200 p-[0.7rem]">
            <div className="flex justify-between gap-2">
              <div>
                <p className="text-[0.8rem] font-bold text-slate-900">{item.therapist.fullName}</p>
                <p className="text-[0.72rem] text-slate-500">{item.therapist.workHours}</p>
              </div>
              <span className="self-start rounded-full bg-cyan-50 px-[0.45rem] py-[0.16rem] text-[0.7rem] font-bold text-cyan-700">
                {item.free} free
              </span>
            </div>
            <div className="h-[0.42rem] overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full"
                style={{ width: `${item.fill}%`, backgroundColor: item.therapist.color }}
              />
            </div>
            <p className="text-[0.72rem] text-slate-500">
              {item.booked} / {item.capacity} booked
            </p>
            <button type="button" className={secondaryButtonClass} onClick={() => onBlockSlot(item.therapist.id)}>
              Block Slot
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
