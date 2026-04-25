import { CheckCircle2, X } from "lucide-react";
import { AppointmentFormState, SessionType, Therapist } from "@/types/appointmentsDashboardTypes";
import { CURRENCY } from "@/utils/appointmentsDashboardUtils";
import { DropdownSelect } from "../custom-ui/dropdown";

interface AppointmentFormModalProps {
  isEditing: boolean;
  formState: AppointmentFormState;
  therapists: Therapist[];
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (nextState: AppointmentFormState) => void;
}

export function AppointmentFormModal({
  isEditing,
  formState,
  therapists,
  onClose,
  onSubmit,
  onChange,
}: AppointmentFormModalProps) {
  const iconButtonClass =
    "inline-flex min-h-8 min-w-8 items-center justify-center rounded-[0.55rem] border border-[#d8dde8] bg-white p-2 text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";
  const secondaryButtonClass =
    "rounded-[0.55rem] border border-[#d8dde8] bg-white px-3 py-[0.55rem] text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";
  const primaryButtonClass =
    "inline-flex items-center gap-[0.35rem] rounded-[0.55rem] border border-[#4acf7f] bg-[#4acf7f] px-3 py-[0.55rem] text-[0.85rem] font-semibold leading-none text-white transition-all duration-150 ease-in hover:border-[#3ebd70] hover:bg-[#3ebd70]";
  const selectClass =
    "min-w-[11.5rem] rounded-[0.55rem] border border-[#d8dde8] bg-white px-3 py-[0.55rem] text-[0.85rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";
  const fieldClass = "flex flex-col gap-[0.32rem]";
  const fieldLabelClass = "text-[0.72rem] font-bold text-slate-600";
  const inputClass = "rounded-[0.55rem] border border-[#dbe3ef] bg-white px-[0.6rem] py-[0.48rem] text-[0.82rem] text-slate-900";

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center bg-slate-900/45 p-4">
      <form
        className="flex w-[min(46rem,96vw)] flex-col gap-[0.85rem] rounded-[0.95rem] border border-[#dbe3ef] bg-white p-[0.95rem] shadow-[0_20px_40px_rgba(15,23,42,0.2)]"
        onSubmit={onSubmit}
      >
        <header className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">{isEditing ? "Edit Appointment" : "Create Appointment"}</h3>
          <button type="button" className={iconButtonClass} onClick={onClose} aria-label="Close modal">
            <X size={14} />
          </button>
        </header>

        <div className="grid grid-cols-3 gap-[0.6rem] max-[1100px]:grid-cols-2 max-[760px]:grid-cols-1">
          <label className={fieldClass}>
            <span className={fieldLabelClass}>Client Name</span>
            <input
              className={inputClass}
              required
              value={formState.clientName}
              onChange={(event) => onChange({ ...formState, clientName: event.target.value })}
              placeholder="Client full name"
            />
          </label>

          <label className={fieldClass}>
            <span className={fieldLabelClass}>Client Phone</span>
            <input
              className={inputClass}
              value={formState.clientPhone}
              onChange={(event) => onChange({ ...formState, clientPhone: event.target.value })}
              placeholder="+1 000-000-0000"
            />
          </label>

          <label className={fieldClass}>
            <span className={fieldLabelClass}>Therapist</span>
            <DropdownSelect
              triggerClassName={selectClass}
              value={formState.therapistId}
              onChange={(event) => onChange({ ...formState, therapistId: event.target.value })}
              options={therapists.map((therapist) => ({ value: therapist.id, label: therapist.fullName }))}
            />
          </label>

          <label className={fieldClass}>
            <span className={fieldLabelClass}>Date</span>
            <input
              className={inputClass}
              type="date"
              required
              value={formState.date}
              onChange={(event) => onChange({ ...formState, date: event.target.value })}
            />
          </label>

          <label className={fieldClass}>
            <span className={fieldLabelClass}>Start Time</span>
            <input
              className={inputClass}
              type="time"
              required
              value={formState.startTime}
              onChange={(event) => onChange({ ...formState, startTime: event.target.value })}
            />
          </label>

          <label className={fieldClass}>
            <span className={fieldLabelClass}>Duration</span>
            <DropdownSelect
              triggerClassName={selectClass}
              value={String(formState.duration)}
              onChange={(event) => onChange({ ...formState, duration: Number(event.target.value) })}
              options={[30, 45, 50, 60, 90].map((minutes) => ({ value: String(minutes), label: `${minutes} min` }))}
            />
          </label>

          <label className={fieldClass}>
            <span className={fieldLabelClass}>Session Type</span>
            <DropdownSelect
              triggerClassName={selectClass}
              value={formState.sessionType}
              onChange={(event) => onChange({ ...formState, sessionType: event.target.value as SessionType })}
              options={[
                { value: "individual", label: "Individual" },
                { value: "group", label: "Group" },
                { value: "online", label: "Online" },
              ]}
            />
          </label>

          <label className={fieldClass}>
            <span className={fieldLabelClass}>Room</span>
            <input
              className={inputClass}
              value={formState.room}
              onChange={(event) => onChange({ ...formState, room: event.target.value })}
            />
          </label>

          <label className={fieldClass}>
            <span className={fieldLabelClass}>Price</span>
            <input
              className={inputClass}
              type="number"
              min={0}
              value={formState.price}
              onChange={(event) => onChange({ ...formState, price: Number(event.target.value) })}
            />
          </label>
        </div>

        <label className={fieldClass}>
          <span className={fieldLabelClass}>Notes</span>
          <textarea
            className={`${inputClass} resize-y`}
            value={formState.notes}
            onChange={(event) => onChange({ ...formState, notes: event.target.value })}
            rows={3}
          />
        </label>

        <footer className="flex items-center justify-between gap-[0.7rem] max-[760px]:flex-col max-[760px]:items-start">
          <p className="inline-flex items-center gap-[0.35rem] text-[0.8rem] text-slate-700">
            <CheckCircle2 size={14} />
            Estimated revenue: {CURRENCY.format(formState.price)}
          </p>
          <div className="flex gap-[0.45rem]">
            <button type="button" className={secondaryButtonClass} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={primaryButtonClass}>
              {isEditing ? "Save Changes" : "Create Appointment"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}
