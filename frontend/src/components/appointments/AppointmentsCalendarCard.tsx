import { CalendarRange, Clock3, Users } from "lucide-react";
import { ActiveView, Appointment } from "@/types/appointmentsDashboardTypes";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import {
  cx,
  formatDateLabel,
  parseDateOnly,
  toDateOnly,
} from "@/utils/appointmentsDashboardUtils";
import { SESSION_LABELS } from "@/data/appointmentsData/appointmentsDashboardData";

interface AppointmentsCalendarCardProps {
  activeView: ActiveView;
  selectedDate: Date;
  rangeDates: Date[];
  filteredForCurrentRange: Appointment[];
  groupedAgenda: [string, Appointment[]][];
  onEdit: (appointment: Appointment) => void;
  onToggleCancel: (appointmentId: string, isCancelled: boolean) => void;
}

export function AppointmentsCalendarCard({
  activeView,
  selectedDate,
  rangeDates,
  filteredForCurrentRange,
  groupedAgenda,
  onEdit,
  onToggleCancel,
}: AppointmentsCalendarCardProps) {
  const ghostInlineClass =
    "rounded-[0.55rem] border border-[#d8dde8] bg-white px-[0.45rem] py-[0.35rem] text-[0.72rem] font-semibold leading-none text-slate-900 transition-all duration-150 ease-in hover:bg-slate-50";
  const ghostInlineDangerClass =
    "rounded-[0.55rem] border border-[#f2c9c9] bg-white px-[0.45rem] py-[0.35rem] text-[0.72rem] font-semibold leading-none text-red-600 transition-all duration-150 ease-in hover:bg-slate-50";

  const dayColumns =
    activeView === "day"
      ? [selectedDate]
      : activeView === "week"
        ? rangeDates.slice(0, 7)
        : activeView === "month"
          ? []
          : [selectedDate];

  return (
    <section className="rounded-[0.9rem] border border-slate-200 bg-white p-[0.9rem]">
      {(activeView === "day" || activeView === "week") && (
        <div
          className={cx(
            "overscroll-x-contain overflow-x-auto pb-[0.3rem] [scrollbar-width:thin]",
            activeView === "day" && "overflow-x-visible pb-0",
          )}
        >
          <div
            className={cx(
              "grid grid-flow-col auto-cols-[calc((100%-1.95rem)/4)] gap-[0.65rem]",
              activeView === "day" && "grid-flow-row auto-cols-[minmax(0,1fr)]",
            )}
          >
            {dayColumns.map((columnDate) => {
              const key = toDateOnly(columnDate);
              const columnAppointments = filteredForCurrentRange.filter((item) => item.date === key);
              return (
                <article key={key} className="min-h-80 rounded-[0.8rem] border border-gray-200 bg-[#fafbfd]">
                  <header className="flex items-center justify-between border-b border-slate-200 px-3 py-[0.7rem] text-xs font-semibold text-slate-600">
                    <span>{formatDateLabel(columnDate)}</span>
                    <span>{columnAppointments.length} sessions</span>
                  </header>
                  <div className="flex flex-col gap-[0.55rem] p-[0.55rem]">
                    {columnAppointments.length === 0 && (
                      <p className="p-4 text-center text-[0.85rem] text-slate-400">No appointments</p>
                    )}
                    {columnAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex flex-col gap-[0.35rem] rounded-[0.65rem] border border-[#d9e5f3] border-l-4 bg-white px-[0.65rem] py-[0.55rem]"
                        style={{ borderLeftColor: appointment.therapist.color }}
                      >
                        <div className="flex justify-between gap-2">
                          <p className="text-[0.82rem] font-bold text-slate-900">{appointment.client.fullName}</p>
                          <AppointmentStatusBadge status={appointment.status} />
                        </div>
                        <p className="flex items-center gap-[0.3rem] text-[0.74rem] text-slate-600">
                          <Clock3 size={12} />
                          {appointment.startTime} - {appointment.endTime} ({appointment.duration}m)
                        </p>
                        <p className="flex items-center gap-[0.3rem] text-[0.74rem] text-slate-600">
                          <Users size={12} />
                          {appointment.therapist.fullName}
                        </p>
                        <div className="mt-[0.2rem] flex gap-[0.35rem]">
                          <button type="button" className={ghostInlineClass} onClick={() => onEdit(appointment)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className={ghostInlineDangerClass}
                            onClick={() => onToggleCancel(appointment.id, appointment.status === "cancelled")}
                          >
                            {appointment.status === "cancelled" ? "Restore" : "Cancel"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {activeView === "month" && (
        <div className="grid grid-cols-7 gap-2 max-[1100px]:grid-cols-4 max-[760px]:grid-cols-1">
          {rangeDates.map((date) => {
            const key = toDateOnly(date);
            const dayAppointments = filteredForCurrentRange.filter((item) => item.date === key);
            const inCurrentMonth = date.getMonth() === selectedDate.getMonth();
            return (
              <article
                key={key}
                className={cx(
                  "flex min-h-[7.9rem] flex-col gap-[0.4rem] rounded-[0.7rem] border border-slate-200 p-[0.4rem]",
                  !inCurrentMonth && "opacity-55",
                )}
              >
                <div className="flex items-center justify-between text-[0.76rem] font-bold">
                  <span>{date.getDate()}</span>
                  {dayAppointments.length > 0 && (
                    <span className="rounded-full bg-emerald-50 px-[0.42rem] py-[0.12rem] text-green-700">
                      {dayAppointments.length}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-[0.28rem]">
                  {dayAppointments.slice(0, 2).map((appointment) => (
                    <p key={appointment.id} className="rounded-[0.42rem] bg-slate-50 px-[0.3rem] py-[0.2rem] text-[0.72rem] text-slate-800">
                      {appointment.startTime} {appointment.client.fullName}
                    </p>
                  ))}
                  {dayAppointments.length > 2 && (
                    <p className="text-[0.7rem] text-slate-500">+{dayAppointments.length - 2} more</p>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {activeView === "agenda" && (
        <div className="flex flex-col gap-[0.8rem]">
          {groupedAgenda.length === 0 && (
            <p className="p-4 text-center text-[0.85rem] text-slate-400">No appointments in this range.</p>
          )}
          {groupedAgenda.map(([date, dateAppointments]) => (
            <article key={date} className="overflow-hidden rounded-xl border border-slate-200">
              <header className="flex items-center gap-[0.4rem] border-b border-slate-200 bg-slate-50 px-3 py-[0.65rem] text-[0.82rem] font-bold text-slate-700">
                <CalendarRange size={14} />
                {parseDateOnly(date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </header>
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.72rem] font-bold uppercase text-slate-500">
                        Time
                      </th>
                      <th className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.72rem] font-bold uppercase text-slate-500">
                        Client
                      </th>
                      <th className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.72rem] font-bold uppercase text-slate-500">
                        Therapist
                      </th>
                      <th className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.72rem] font-bold uppercase text-slate-500">
                        Type
                      </th>
                      <th className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.72rem] font-bold uppercase text-slate-500">
                        Room
                      </th>
                      <th className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.72rem] font-bold uppercase text-slate-500">
                        Duration
                      </th>
                      <th className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.72rem] font-bold uppercase text-slate-500">
                        Status
                      </th>
                      <th className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.72rem] font-bold uppercase text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dateAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-green-50">
                        <td className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.79rem]">
                          {appointment.startTime} - {appointment.endTime}
                        </td>
                        <td className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.79rem]">
                          {appointment.client.fullName}
                        </td>
                        <td className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.79rem]">
                          {appointment.therapist.fullName}
                        </td>
                        <td className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.79rem]">
                          <span className="rounded-full bg-slate-100 px-[0.45rem] py-[0.17rem] text-[0.7rem] font-bold text-slate-700">
                            {SESSION_LABELS[appointment.sessionType]}
                          </span>
                        </td>
                        <td className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.79rem]">
                          {appointment.room ?? "-"}
                        </td>
                        <td className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.79rem]">
                          {appointment.duration} min
                        </td>
                        <td className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.79rem]">
                          <AppointmentStatusBadge status={appointment.status} />
                        </td>
                        <td className="border-b border-slate-100 px-[0.6rem] py-[0.55rem] text-left text-[0.79rem]">
                          <div className="flex gap-[0.3rem]">
                            <button type="button" className={ghostInlineClass} onClick={() => onEdit(appointment)}>
                              Edit
                            </button>
                            <button
                              type="button"
                              className={ghostInlineDangerClass}
                              onClick={() => onToggleCancel(appointment.id, false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
