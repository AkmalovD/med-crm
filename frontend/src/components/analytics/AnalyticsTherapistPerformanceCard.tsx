import { ChevronDown, Download, Search } from "lucide-react";
import { THERAPIST_PAGE_SIZE, THERAPISTS } from "@/data/analyticsData/analyticsDashboardData";
import { TherapistItem, TherapistSortBy } from "../../types/analyticsDashboardTypes";
import { CURRENCY, NUMBER, cx } from "../../utils/analyticsDashboardUtils";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "../custom-ui/dropdown";

interface AnalyticsTherapistPerformanceCardProps {
  query: string;
  sortBy: TherapistSortBy;
  page: number;
  totalPages: number;
  therapistRows: TherapistItem[];
  onQueryChange: (value: string) => void;
  onSortChange: (value: TherapistSortBy) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export function AnalyticsTherapistPerformanceCard({
  query,
  sortBy,
  page,
  totalPages,
  therapistRows,
  onQueryChange,
  onSortChange,
  onPreviousPage,
  onNextPage,
}: AnalyticsTherapistPerformanceCardProps) {
  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-[box-shadow,transform] duration-200 ease-in hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] max-[760px]:p-[14px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-[#1a1a2e]">Therapist Performance Breakdown</h3>
          <span className="rounded-full bg-[#edfaf3] px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {NUMBER.format(THERAPISTS.length)} therapists
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-[34px] items-center gap-1.5 rounded-lg border border-[var(--border)] bg-white px-2.5">
            <Search size={14} className="text-slate-400" />
            <input
              className="w-[180px] border-0 bg-transparent text-[13px] text-slate-700 outline-none"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search therapist"
            />
          </label>
          <Dropdown align="end">
            <div className="relative inline-flex">
              <DropdownTrigger className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-[10px] py-1.5 text-[13px] text-slate-600">
                <span>
                  {sortBy === "completion" && "Sort: Completion Rate"}
                  {sortBy === "sessions" && "Sort: Total Sessions"}
                  {sortBy === "revenue" && "Sort: Revenue"}
                  {sortBy === "name" && "Sort: Name"}
                </span>
                <ChevronDown size={14} className="text-slate-400" />
              </DropdownTrigger>
              <DropdownContent className="min-w-52">
                <DropdownItem
                  className={sortBy === "completion" ? "bg-slate-100 text-slate-900" : undefined}
                  onClick={() => onSortChange("completion")}
                >
                  Sort: Completion Rate
                </DropdownItem>
                <DropdownItem
                  className={sortBy === "sessions" ? "bg-slate-100 text-slate-900" : undefined}
                  onClick={() => onSortChange("sessions")}
                >
                  Sort: Total Sessions
                </DropdownItem>
                <DropdownItem
                  className={sortBy === "revenue" ? "bg-slate-100 text-slate-900" : undefined}
                  onClick={() => onSortChange("revenue")}
                >
                  Sort: Revenue
                </DropdownItem>
                <DropdownItem
                  className={sortBy === "name" ? "bg-slate-100 text-slate-900" : undefined}
                  onClick={() => onSortChange("name")}
                >
                  Sort: Name
                </DropdownItem>
              </DropdownContent>
            </div>
          </Dropdown>
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-slate-500"
            aria-label="Export table"
          >
            <Download size={14} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1080px] w-full border-collapse [&_th]:border-b [&_th]:border-[var(--border)] [&_th]:px-2 [&_th]:py-2.5 [&_th]:text-left [&_th]:text-[11px] [&_th]:font-bold [&_th]:uppercase [&_th]:tracking-[0.04em] [&_th]:text-slate-400 [&_td]:whitespace-nowrap [&_td]:border-b [&_td]:border-[#edf1f7] [&_td]:px-2 [&_td]:py-3 [&_td]:text-[13px] [&_td]:text-slate-600 [&_tbody_tr:nth-child(even)]:bg-[#fbfdff] [&_tbody_tr:hover]:bg-[#f0fdf4]">
          <thead>
            <tr>
              <th>Therapist</th>
              <th>Total Sessions</th>
              <th>Completed</th>
              <th>Cancelled</th>
              <th>No-show</th>
              <th>Revenue</th>
              <th>Avg Duration</th>
              <th>Completion Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {therapistRows.map((therapist) => {
              const completion = Math.round((therapist.completed / therapist.sessions) * 100);
              return (
                <tr key={therapist.name}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700">
                        {therapist.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1a1a2e]">{therapist.name}</p>
                        <p className="text-xs text-slate-500">{therapist.specialization}</p>
                      </div>
                    </div>
                  </td>
                  <td>{NUMBER.format(therapist.sessions)}</td>
                  <td className="text-emerald-600">{NUMBER.format(therapist.completed)}</td>
                  <td className="text-red-500">{NUMBER.format(therapist.cancelled)}</td>
                  <td className="text-amber-500">{NUMBER.format(therapist.noShow)}</td>
                  <td>{CURRENCY.format(therapist.revenue)}</td>
                  <td>{therapist.avgDuration} min</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-2.5 w-28 rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-[#4acf7f]" style={{ width: `${completion}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-600">{completion}%</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={cx(
                        "inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold",
                        therapist.status === "Active" ? "bg-[#e8fbf4] text-[#109065]" : "bg-[#fff6db] text-[#b68100]",
                      )}
                    >
                      {therapist.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-end gap-4 text-sm text-slate-500">
        <span>Rows per page: {THERAPIST_PAGE_SIZE}</span>
        <button
          type="button"
          className="rounded-lg border border-[var(--border)] bg-white px-[10px] py-1.5 text-[13px] text-slate-500 disabled:opacity-45"
          disabled={page <= 1}
          onClick={onPreviousPage}
        >
          Previous
        </button>
        <span>
          {page} / {totalPages}
        </span>
        <button
          type="button"
          className="rounded-lg border border-[var(--border)] bg-white px-[10px] py-1.5 text-[13px] text-slate-500 disabled:opacity-45"
          disabled={page >= totalPages}
          onClick={onNextPage}
        >
          Next
        </button>
      </div>
    </section>
  );
}
