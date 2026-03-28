"use client";

import { Building2, CheckCircle2, Wrench, Users } from "lucide-react";

import type { Room } from "@/types/roomsDashboardTypes";

import styles from "./RoomsDashboardPage.module.css";

interface RoomUtilizationBarProps {
  rooms: Room[];
  isLoading?: boolean;
}

export function RoomUtilizationBar({ rooms, isLoading }: RoomUtilizationBarProps) {
  if (isLoading) {
    return (
      <div className={styles.statsGrid}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.statCard}>
            <div>
              <div className={styles.subtle} style={{ width: 100, height: 14, background: "#e2e8f0", borderRadius: 4 }} />
              <div
                className={styles.statValue}
                style={{ width: 48, height: 28, marginTop: 8, background: "#e2e8f0", borderRadius: 4 }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const total = rooms.length;
  const available = rooms.filter((r) => r.status === "available").length;
  const occupied = rooms.filter((r) => r.status === "occupied").length;
  const maintenance = rooms.filter((r) => r.status === "maintenance").length;

  const stats = [
    {
      label: "Total rooms",
      value: total,
      icon: Building2,
      bg: "#f1f5f9",
      fg: "#475569",
    },
    {
      label: "Available now",
      value: available,
      icon: CheckCircle2,
      bg: "#dcfce7",
      fg: "#15803d",
    },
    {
      label: "Occupied now",
      value: occupied,
      icon: Users,
      bg: "#fef3c7",
      fg: "#b45309",
    },
    {
      label: "Under maintenance",
      value: maintenance,
      icon: Wrench,
      bg: "#fee2e2",
      fg: "#b91c1c",
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat) => (
        <div key={stat.label} className={styles.statCard}>
          <div>
            <p className={styles.statLabel}>{stat.label}</p>
            <p className={styles.statValue}>{stat.value}</p>
          </div>
          <div className={styles.statIconWrap} style={{ background: stat.bg }}>
            <stat.icon size={20} color={stat.fg} aria-hidden />
          </div>
        </div>
      ))}
    </div>
  );
}
