import { Service } from "@/types/servicesDashboardTypes";
import { currency } from "@/utils/servicesDashboardUtils";
import styles from "./ServicesDashboardPage.module.css";

interface ServiceUsageStatsProps {
  services: Service[];
}

export function ServiceUsageStats({ services }: ServiceUsageStatsProps) {
  const activeCount = services.filter((service) => service.status === "active").length;
  const mostBooked = [...services].sort((left, right) => right.totalBookings - left.totalBookings)[0];
  const highestRevenue = [...services].sort((left, right) => right.totalRevenue - left.totalRevenue)[0];

  return (
    <section className={styles.statsGrid}>
      <article className={styles.statCard}>
        <p className={styles.subtle}>Total Active Services</p>
        <p className={styles.statValue}>{activeCount}</p>
      </article>
      <article className={styles.statCard}>
        <p className={styles.subtle}>Most Booked Service</p>
        <p className={styles.statValue}>{mostBooked?.name ?? "N/A"}</p>
        <p className={styles.subtle}>{mostBooked?.totalBookings ?? 0} bookings</p>
      </article>
      <article className={styles.statCard}>
        <p className={styles.subtle}>Highest Revenue Service</p>
        <p className={styles.statValue}>{highestRevenue?.name ?? "N/A"}</p>
        <p className={styles.subtle}>{currency(highestRevenue?.totalRevenue ?? 0)}</p>
      </article>
    </section>
  );
}
