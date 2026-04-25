import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Client, ClientStatus } from "../../types/clientsDashboardTypes";
import { PAGE_SIZE, STATUS_LABELS, THERAPY_LABELS } from "@/data/clientsData/clientsDashboardData";
import { cx, formatDate, NUMBER } from "../../utils/clientsDashboardUtils";

interface ClientsTableCardProps {
  paginated: Client[];
  selectedIds: Set<string>;
  allOnCurrentPageSelected: boolean;
  safePage: number;
  totalPages: number;
  onToggleSelectAllPage: (checked: boolean) => void;
  onToggleSelectClient: (clientId: string, checked: boolean) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const STATUS_CLASSNAMES: Record<ClientStatus, string> = {
  active: "bg-[#e8fbf4] text-[#109065]",
  inactive: "bg-slate-100 text-slate-500",
  new: "bg-[#e0ecff] text-blue-700",
  discharged: "bg-purple-100 text-purple-700",
  on_hold: "bg-[#fff6db] text-[#b68100]",
};

function StatusBadge({ status }: { status: ClientStatus }) {
  return (
    <span className={cx("inline-flex items-center rounded-full px-[10px] py-1 text-[11px] font-bold", STATUS_CLASSNAMES[status])}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function ClientsTableCard({
  paginated,
  selectedIds,
  allOnCurrentPageSelected,
  safePage,
  totalPages,
  onToggleSelectAllPage,
  onToggleSelectClient,
  onPreviousPage,
  onNextPage,
}: ClientsTableCardProps) {
  const router = useRouter();

  return (
    <section className="overflow-hidden rounded-xl border border-(--border) bg-white">
      <div className="overflow-x-auto">
        <table
          className={cx(
            "w-full min-w-[1180px] border-collapse",
            "[&_th]:border-b [&_th]:border-(--border) [&_th]:px-2 [&_th]:py-[11px] [&_th]:text-left [&_th]:text-[11px] [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-[0.04em] [&_th]:text-slate-400",
            "[&_td]:border-b [&_td]:border-[#edf1f7] [&_td]:px-2 [&_td]:py-3 [&_td]:align-middle [&_td]:text-[13px] [&_td]:text-slate-600 [&_td]:whitespace-nowrap",
            "[&_th:first-child]:pl-[18px] [&_td:first-child]:pl-[18px]",
          )}
        >
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allOnCurrentPageSelected}
                  onChange={(event) => onToggleSelectAllPage(event.target.checked)}
                  aria-label="Select all clients"
                />
              </th>
              <th>Client</th>
              <th>Age / DOB</th>
              <th>Diagnosis</th>
              <th>Therapist</th>
              <th>Therapy Type</th>
              <th>Last Session</th>
              <th>Total Sessions</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={10}>
                  <div className="flex flex-col items-center gap-[10px] px-3 py-10 text-center">
                    <p className="text-lg font-semibold text-slate-700">No clients found</p>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting filters or add your first client.</p>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center gap-2 rounded-lg border-0 bg-(--primary) px-3 text-[13px] font-semibold text-white"
                    >
                      <Plus size={16} />
                      Add your first client
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {paginated.map((client) => (
              <tr key={client.id} className="even:bg-slate-400/10 hover:cursor-pointer hover:bg-green-50">
                <td onClick={(event) => event.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(client.id)}
                    onChange={(event) => onToggleSelectClient(client.id, event.target.checked)}
                    aria-label={`Select ${client.fullName}`}
                  />
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-[30px] w-[30px] items-center justify-center rounded-full bg-slate-200 text-[11px] font-bold text-slate-800">
                      {client.firstName[0]}
                      {client.lastName[0]}
                    </span>
                    <div>
                      <p className="font-semibold text-[#1a1a2e]">{client.fullName}</p>
                      <p className="text-xs text-slate-500">{client.clientCode}</p>
                    </div>
                  </div>
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>
                  <p className="font-semibold text-[#334155]">{client.age}</p>
                  <p className="text-xs text-slate-500">{formatDate(client.dateOfBirth)}</p>
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)} className="max-w-[220px] overflow-hidden text-ellipsis">
                  {client.primaryDiagnosis}
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>
                  <div className="inline-flex items-center gap-[6px]">
                    <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-green-50 text-[10px] font-bold text-[#0f5132]">
                      {client.assignedTherapist.name
                        .replace("Dr. ", "")
                        .split(" ")
                        .map((part) => part[0])
                        .join("")}
                    </span>
                    {client.assignedTherapist.name}
                  </div>
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>
                  <span className="rounded-full bg-indigo-100 px-[9px] py-1 text-[11px] font-bold text-[#3743a7]">
                    {THERAPY_LABELS[client.therapyType]}
                  </span>
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>{formatDate(client.lastSessionDate)}</td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>{NUMBER.format(client.totalSessions)}</td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>
                  <StatusBadge status={client.status} />
                </td>
                <td onClick={(event) => event.stopPropagation()}>
                  <div className="inline-flex items-center gap-[6px]">
                    <button
                      type="button"
                      className="rounded-md border border-(--border) bg-white px-2 py-[3px] text-[11px] font-semibold text-slate-600"
                      onClick={() => router.push(`/clients/${client.id}`)}
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-(--border) bg-white px-2 py-[3px] text-[11px] font-semibold text-slate-600"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-pink-200 bg-pink-50 px-2 py-[3px] text-[11px] font-semibold text-pink-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-end gap-[18px] px-[18px] py-[14px] text-[13px] text-slate-500">
        <span>Rows per page: {PAGE_SIZE}</span>
        <button
          type="button"
          className="rounded-lg border border-(--border) bg-white px-[10px] py-[6px] text-[13px] text-slate-500 disabled:opacity-45"
          disabled={safePage <= 1}
          onClick={onPreviousPage}
        >
          Previous
        </button>
        <span>
          {safePage} / {totalPages}
        </span>
        <button
          type="button"
          className="rounded-lg border border-(--border) bg-white px-[10px] py-[6px] text-[13px] text-slate-500 disabled:opacity-45"
          disabled={safePage >= totalPages}
          onClick={onNextPage}
        >
          Next
        </button>
      </footer>
    </section>
  );
}
