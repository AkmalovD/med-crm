"use client";

import { STAT_CARDS } from "../../data/dashboardData/medicalDashboardData";
import { MedicalStatCard } from "./MedicalStatCard";
import { useTotalSessions } from "@/hooks/useTotalSessions";

export function MedicalStatsGrid() {
  const { data, isLoading, isError } = useTotalSessions();

  const cards = [...STAT_CARDS];

  cards[0] = {
    ...cards[0],
    value: isLoading
      ? "..."
      : isError
      ? "N/A"
      : new Intl.NumberFormat("en-US").format(data?.total ?? 0),
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <MedicalStatCard key={card.label} {...card} />
      ))}
    </div>
  );
}