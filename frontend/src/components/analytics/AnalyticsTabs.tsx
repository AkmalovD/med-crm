import { TABS } from "@/data/analyticsData/analyticsDashboardData";
import { AnalyticsTab } from "../../types/analyticsDashboardTypes";
import { cx } from "../../utils/analyticsDashboardUtils";

interface AnalyticsTabsProps {
  activeTab: AnalyticsTab;
  onTabChange: (tab: AnalyticsTab) => void;
}

export function AnalyticsTabs({ activeTab, onTabChange }: AnalyticsTabsProps) {
  return (
    <div className="flex gap-[18px] overflow-x-auto border-b border-[var(--border)]">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          className={cx(
            "border-0 border-b-2 border-transparent bg-transparent py-2.5 text-sm font-semibold text-slate-500",
            activeTab === tab && "border-b-[var(--primary)] text-[var(--primary)]",
          )}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
