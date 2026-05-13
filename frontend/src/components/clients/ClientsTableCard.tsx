import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Client, ClientStatus } from "../../types/clientsDashboardTypes";
import { PAGE_SIZE, STATUS_LABELS } from "@/data/clientsData/clientsDashboardData";
import { cx, NUMBER } from "../../utils/clientsDashboardUtils";
import { useDeleteClient } from "../../hooks/useClients";

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
  onAddClient: () => void;
}

const STATUS_CLASSNAMES: Record<ClientStatus, string> = {
  active: "bg-[#e8fbf4] text-[#109065]",
  inactive: "bg-slate-100 text-slate-500",
};

function StatusBadge({ status }: { status: string }) {
  const key = (status as ClientStatus) in STATUS_CLASSNAMES ? (status as ClientStatus) : "inactive";
  return (
    <span className={cx("inline-flex items-center rounded-full px-[10px] py-1 text-[11px] font-bold", STATUS_CLASSNAMES[key])}>
      {STATUS_LABELS[key]}
    </span>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
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
  onAddClient,
}: ClientsTableCardProps) {
  const router = useRouter();
  const deleteClient = useDeleteClient();

  return (
    <section className="overflow-hidden rounded-xl border border-(--border) bg-white">
      <div className="overflow-x-auto">
        <table
          className={cx(
            "w-full min-w-[900px] border-collapse",
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
              <th>Organization</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={8}>
                  <div className="flex flex-col items-center gap-[10px] px-3 py-10 text-center">
                    <p className="text-lg font-semibold text-slate-700">No clients found</p>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting filters or add your first client.</p>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center gap-2 rounded-lg border-0 bg-(--primary) px-3 text-[13px] font-semibold text-white"
                      onClick={onAddClient}
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
                      {initials(client.fullName)}
                    </span>
                    <p className="font-semibold text-[#1a1a2e]">{client.fullName}</p>
                  </div>
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>
                  {client.organization ?? <span className="text-slate-400">—</span>}
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>
                  {client.email}
                </td>
                <td onClick={() => router.push(`/clients/${client.id}`)}>
                  {client.number}
                </td>
                <td
                  onClick={() => router.push(`/clients/${client.id}`)}
                  className="max-w-[200px] overflow-hidden text-ellipsis"
                >
                  {client.address ?? <span className="text-slate-400">—</span>}
                </td>
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
                      disabled={deleteClient.isPending}
                      className="rounded-md border border-pink-200 bg-pink-50 px-2 py-[3px] text-[11px] font-semibold text-pink-700 disabled:opacity-50"
                      onClick={() => deleteClient.mutate(client.id)}
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
