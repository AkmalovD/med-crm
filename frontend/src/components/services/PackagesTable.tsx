import { Service, ServicePackage } from "@/types/servicesDashboardTypes";
import { currency } from "@/utils/servicesDashboardUtils";
import styles from "./ServicesDashboardPage.module.css";

interface PackagesTableProps {
  packages: ServicePackage[];
  servicesById: Record<string, Service | undefined>;
  onTogglePackageStatus: (id: string) => void;
}

export function PackagesTable({ packages, servicesById, onTogglePackageStatus }: PackagesTableProps) {
  if (packages.length === 0) {
    return <div className={styles.panel}>No packages yet.</div>;
  }

  return (
    <section className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Package</th>
            <th>Service</th>
            <th>Sessions</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Validity</th>
            <th>Sold</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {packages.map((item) => {
            const service = servicesById[item.serviceId];
            const fullPrice = (service?.price ?? 0) * item.sessionCount;
            const discountPercent =
              fullPrice > 0 ? Math.max(0, Math.round(((fullPrice - item.price) / fullPrice) * 100)) : 0;
            return (
              <tr key={item.id}>
                <td>
                  <strong>{item.name}</strong>
                  <div className={styles.subtle}>{item.description ?? "No description"}</div>
                </td>
                <td>{service?.name ?? "Unknown service"}</td>
                <td>{item.sessionCount} sessions</td>
                <td>{currency(item.price, item.currency)}</td>
                <td>{discountPercent}%</td>
                <td>{item.validityDays} days</td>
                <td>{item.totalSold}</td>
                <td>{item.status}</td>
                <td>
                  <div className={styles.actionsRow}>
                    <button type="button" className={styles.ghostButton}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={() => onTogglePackageStatus(item.id)}
                    >
                      Toggle
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
