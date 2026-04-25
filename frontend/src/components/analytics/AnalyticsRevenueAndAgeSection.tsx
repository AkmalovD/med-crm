import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AGE_DISTRIBUTION, MONTHLY_OVERVIEW, PRIMARY } from "@/data/analyticsData/analyticsDashboardData";
import { SeriesToggle } from "../../types/analyticsDashboardTypes";
import { CURRENCY, NUMBER, cx, normalizeNumericValue, formatPercentTooltip } from "../../utils/analyticsDashboardUtils";
import { AnalyticsChartCard } from "./AnalyticsChartCard";

interface AnalyticsRevenueAndAgeSectionProps {
  seriesToggle: SeriesToggle;
  onSeriesToggleChange: (value: SeriesToggle) => void;
}

export function AnalyticsRevenueAndAgeSection({
  seriesToggle,
  onSeriesToggleChange,
}: AnalyticsRevenueAndAgeSectionProps) {
  return (
    <section className="grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-4 max-xl:grid-cols-1">
      <AnalyticsChartCard title="Revenue & Sessions Over Time">
        <div className="mb-3 flex items-center justify-end gap-2">
          {(["Sessions", "Revenue", "Both"] as const).map((option) => (
            <button
              key={option}
              type="button"
              className={cx(
                "rounded-lg border border-[var(--border)] bg-white px-[10px] py-1.5 text-xs font-semibold text-slate-600",
                seriesToggle === option && "border-[var(--primary)] bg-[#edfaf3] text-[#0f5132]",
              )}
              onClick={() => onSeriesToggleChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={MONTHLY_OVERVIEW}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="sessions" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="revenue" orientation="right" tick={{ fill: "#64748b", fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(value, name) => {
                  const metricName = String(name ?? "");
                  return [
                    metricName === "revenue"
                      ? CURRENCY.format(normalizeNumericValue(value))
                      : NUMBER.format(normalizeNumericValue(value)),
                    metricName,
                  ] as const;
                }}
              />
              {(seriesToggle === "Sessions" || seriesToggle === "Both") && (
                <Bar yAxisId="sessions" dataKey="sessions" fill="#a5b4fc" radius={[8, 8, 0, 0]} />
              )}
              {(seriesToggle === "Revenue" || seriesToggle === "Both") && (
                <Line yAxisId="revenue" dataKey="revenue" stroke={PRIMARY} strokeWidth={3} type="monotone" dot={false} />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsChartCard>

      <AnalyticsChartCard title="Client Age Group Distribution">
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={AGE_DISTRIBUTION} layout="vertical" margin={{ left: 24 }}>
              <XAxis type="number" hide />
              <YAxis
                dataKey="group"
                type="category"
                width={98}
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip formatter={(value) => formatPercentTooltip(value, "Share")} />
              <Bar dataKey="pct" radius={[0, 8, 8, 0]}>
                {AGE_DISTRIBUTION.map((entry, index) => (
                  <Cell key={entry.group} fill={`rgba(74, 207, 127, ${0.45 + index * 0.1})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </AnalyticsChartCard>
    </section>
  );
}
