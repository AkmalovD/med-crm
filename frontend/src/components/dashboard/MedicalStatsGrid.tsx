"use client";

import { STAT_CARDS } from "../../data/dashboardData/medicalDashboardData";
import { MedicalStatCard } from "./MedicalStatCard";
import { useTotalSessions } from "@/hooks/useTotalSessions";
import { useTotalPatients } from "@/hooks/useTotalPatients";

export function MedicalStatsGrid() {
  const { data: sessionsData, isLoading: sessionsLoading, isError: sessionsError } = useTotalSessions();
  const { data: patientsData, isLoading: patientsLoading, isError: patientsError } = useTotalPatients();

  const cards = [...STAT_CARDS];

  cards[0] = {
    ...cards[0],
    value: sessionsLoading
      ? "..."
      : sessionsError
      ? "N/A"
      : new Intl.NumberFormat("en-US").format(sessionsData?.total ?? 0),
  };

  cards[2] = {
    ...cards[2],
    value: patientsLoading
      ? "..."
      : patientsError
      ? "N/A"
      : new Intl.NumberFormat("en-US").format(patientsData?.total ?? 0),
  };

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map((card) => (
        <MedicalStatCard key={card.label} {...card} />
      ))}
    </div>
  );
}