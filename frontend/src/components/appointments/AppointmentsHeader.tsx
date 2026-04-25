import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Therapist } from "@/types/appointmentsDashboardTypes";
import { DropdownSelect } from "../custom-ui/dropdown";

interface AppointmentsHeaderProps {
  formattedRange: string;
  therapistFilter: string;
  therapists: Therapist[];
  onPrev: () => void;
  onToday: () => void;
  onNext: () => void;
  onTherapistFilterChange: (value: string) => void;
  onNewAppointment: () => void;
}

export function AppointmentsHeader({
  formattedRange,
  therapistFilter,
  therapists,
  onPrev,
  onToday,
  onNext,
  onTherapistFilterChange,
  onNewAppointment,
}: AppointmentsHeaderProps) {
  const iconButtonClass =
    "inline-flex min-h-8 min-w-8 items-center justify-center rounded-[0.55rem] border border-[#d8dde8] bg-white p-2 text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";
  const secondaryButtonClass =
    "rounded-[0.55rem] border border-[#d8dde8] bg-white px-3 py-[0.55rem] text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";
  const selectClass =
    "min-w-[11.5rem] rounded-[0.55rem] border border-[#d8dde8] bg-white px-3 py-[0.55rem] text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";
  const primaryButtonClass =
    "inline-flex items-center gap-[0.35rem] rounded-[0.55rem] border border-[#4acf7f] bg-[#4acf7f] px-3 py-[0.55rem] text-[0.85rem] font-semibold leading-none text-white transition-all duration-150 ease-in hover:border-[#3ebd70] hover:bg-[#3ebd70]";

  return (
    <header className="flex items-start justify-between gap-4 max-[760px]:flex-col">
      <div className="flex flex-col gap-[0.3rem]">
        <h1 className="text-[2rem] font-bold leading-none text-[#1a1a2e]">Appointments</h1>
        <span className="text-[0.9rem] text-slate-500">Manage sessions, waitlist, and therapist availability</span>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-[0.6rem] max-[760px]:w-full max-[760px]:justify-start">
        <div className="flex items-center gap-[0.45rem]">
          <button type="button" className={iconButtonClass} onClick={onPrev} aria-label="Go to previous range">
            <ChevronLeft size={16} />
          </button>
          <button type="button" className={secondaryButtonClass} onClick={onToday}>
            Today
          </button>
          <button type="button" className={iconButtonClass} onClick={onNext} aria-label="Go to next range">
            <ChevronRight size={16} />
          </button>
          <span className="ml-[0.2rem] whitespace-nowrap text-[0.85rem] font-semibold text-slate-900">{formattedRange}</span>
        </div>
        <DropdownSelect
          triggerClassName={selectClass}
          value={therapistFilter}
          onChange={(event) => onTherapistFilterChange(event.target.value)}
          aria-label="Filter by therapist"
          options={[
            { value: "", label: "All therapists" },
            ...therapists.map((therapist) => ({ value: therapist.id, label: therapist.fullName })),
          ]}
        />
        <button type="button" className={primaryButtonClass} onClick={onNewAppointment}>
          <Plus size={16} />
          New Appointment
        </button>
      </div>
    </header>
  );
}
