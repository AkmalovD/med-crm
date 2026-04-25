import { ActiveView } from "@/types/appointmentsDashboardTypes";
import { cx } from "@/utils/appointmentsDashboardUtils";

interface AppointmentsViewToggleProps {
  activeView: ActiveView;
  onChange: (view: ActiveView) => void;
}

export function AppointmentsViewToggle({ activeView, onChange }: AppointmentsViewToggleProps) {
  return (
    <section className="inline-flex w-fit items-center overflow-hidden rounded-[0.7rem] border border-[#dbe3ef]">
      {(["day", "week", "month", "agenda"] as const).map((view) => (
        <button
          key={view}
          type="button"
          className={cx(
            "min-w-[5.5rem] border-0 border-r border-r-slate-200 bg-white px-3 py-[0.55rem] text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50 last:border-r-0",
            activeView === view && "border-[#4acf7f] bg-[#4acf7f] text-white hover:bg-[#4acf7f]",
          )}
          onClick={() => onChange(view)}
        >
          {view[0].toUpperCase()}
          {view.slice(1)}
        </button>
      ))}
    </section>
  );
}
