"use client";

import { useState } from "react";
import { ChevronDown, Download, Info } from "lucide-react";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "../custom-ui/dropdown";
import styles from "./AnalyticsDashboardPage.module.css";

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
    <section className={styles.analyticsCard}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-[#1a1a2e]">{title}</h3>
          <Info size={14} className="text-slate-400" />
        </div>
        <div className="flex items-center gap-2">
          {filter && (
            <Dropdown align="end">
              <div className="relative inline-flex">
                <DropdownTrigger className={`${styles.analyticsFilter} inline-flex items-center gap-2`}>
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
          <button type="button" className={styles.analyticsIconButton} aria-label={`Export ${title}`}>
            <Download size={15} />
          </button>
        </div>
      </div>
      {loading ? (
        <div className={styles.analyticsSkeleton} />
      ) : hasData ? (
        children
      ) : (
        <div className={styles.analyticsEmptyState}>No data available for this period.</div>
      )}
    </section>
  );
}
