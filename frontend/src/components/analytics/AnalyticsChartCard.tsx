"use client";

import { useState } from "react";
import { ChevronDown, Download, Info } from "lucide-react";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "../custom-ui/dropdown";

interface AnalyticsChartCardProps {
  title: string;
  filter?: boolean;
  loading?: boolean;
  hasData?: boolean;
  children: React.ReactNode;
}

export function AnalyticsChartCard({
  title,
  filter = true,
  loading = false,
  hasData = true,
  children,
}: AnalyticsChartCardProps) {
  const [period, setPeriod] = useState<"Monthly" | "Weekly" | "Yearly">("Monthly");

  return (
    <section className="rounded-xl border border-[var(--border)] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-[box-shadow,transform] duration-200 ease-in hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] max-[760px]:p-[14px]">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[#1a1a2e]">{title}</h3>
          <Info size={14} className="text-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          {filter && (
            <Dropdown align="end">
              <div className="relative inline-flex">
                <DropdownTrigger className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white px-[10px] py-1.5 text-[13px] text-slate-600">
                  <span>{period}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </DropdownTrigger>
                <DropdownContent className="min-w-36">
                  <DropdownItem
                    className={period === "Monthly" ? "bg-slate-100 text-slate-900" : undefined}
                    onClick={() => setPeriod("Monthly")}
                  >
                    Monthly
                  </DropdownItem>
                  <DropdownItem
                    className={period === "Weekly" ? "bg-slate-100 text-slate-900" : undefined}
                    onClick={() => setPeriod("Weekly")}
                  >
                    Weekly
                  </DropdownItem>
                  <DropdownItem
                    className={period === "Yearly" ? "bg-slate-100 text-slate-900" : undefined}
                    onClick={() => setPeriod("Yearly")}
                  >
                    Yearly
                  </DropdownItem>
                </DropdownContent>
              </div>
            </Dropdown>
          )}
          <button
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border)] bg-white text-slate-500"
            aria-label={`Export ${title}`}
          >
            <Download size={15} />
          </button>
        </div>
      </div>
      {loading ? (
        <div className="h-72 animate-pulse rounded-[10px] bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 [background-size:300%_100%]" />
      ) : hasData ? (
        children
      ) : (
        <div className="flex h-72 items-center justify-center rounded-[10px] border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
          No data available for this period.
        </div>
      )}
    </section>
  );
}
