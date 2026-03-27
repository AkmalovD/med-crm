import { CalendarClock, Download } from "lucide-react";

const TODAY_APPOINTMENTS = [
  {
    id: "A-101",
    time: "09:30",
    patient: "Emily Turner",
    provider: "Dr. Daniel Price",
    type: "Follow-up",
    status: "In 10 min",
  },
  {
    id: "A-102",
    time: "10:15",
    patient: "Michael Smith",
    provider: "Dr. Sophia Lane",
    type: "Consultation",
    status: "On time",
  },
  {
    id: "A-103",
    time: "11:00",
    patient: "Olivia Brown",
    provider: "Dr. Mia Carter",
    type: "Routine Check",
    status: "Checked in",
  },
  {
    id: "A-104",
    time: "12:45",
    patient: "Noah Wilson",
    provider: "Dr. Ethan Green",
    type: "Lab Review",
    status: "On time",
  },
];

export function MedicalAppointmentsMapCard() {
  const totalAppointments = TODAY_APPOINTMENTS.length;
  const soonCount = TODAY_APPOINTMENTS.filter((appointment) => appointment.status === "In 10 min").length;

  return (
    <div className="border border-(--border) rounded-[14px] bg-(--panel) p-5 px-[22px] flex flex-col">
      <div className="flex justify-between items-start">
        <h2 className="text-[15px] font-semibold text-slate-800 max-w-[180px] leading-[1.35]">
          Upcoming Appointments Today
        </h2>
        <button
          type="button"
          className="bg-transparent border-0 text-slate-400 cursor-pointer p-0.5 hover:text-slate-600"
        >
          <Download size={16} />
        </button>
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 px-3 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <CalendarClock size={16} style={{ color: "#4acf7f" }} />
          <span className="text-[12px] font-medium">{totalAppointments} appointments scheduled</span>
        </div>
        <span className="text-[11px] text-amber-600 font-semibold">{soonCount} starting soon</span>
      </div>

      <div className="mt-4 space-y-2.5">
        {TODAY_APPOINTMENTS.map((appointment) => (
          <div
            key={appointment.id}
            className="rounded-[10px] border border-slate-100 bg-white px-3 py-2.5 flex items-start justify-between gap-2"
          >
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-slate-800 truncate">{appointment.patient}</p>
              <p className="text-[11px] text-slate-500 truncate">
                {appointment.provider} · {appointment.type}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[12px] font-semibold text-slate-700">{appointment.time}</p>
              <span
                className={
                  appointment.status === "In 10 min"
                    ? "text-[10px] font-semibold text-amber-600"
                    : "text-[10px] font-semibold"
                }
                style={appointment.status === "In 10 min" ? undefined : { color: "#4acf7f" }}
              >
                {appointment.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
