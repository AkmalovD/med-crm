import { SERVICE_CATEGORY_LABELS, THERAPIST_OPTIONS } from "@/data/servicesData/servicesDashboardData";
import { Service } from "@/types/servicesDashboardTypes";
import { currency, getInitials } from "@/utils/servicesDashboardUtils";
import styles from "./ServicesDashboardPage.module.css";

interface ServicesTableProps {
  services: Service[];
  onToggleStatus: (id: string) => void;
}

export function ServicesTable({ services, onToggleStatus }: ServicesTableProps) {
  if (services.length === 0) {
    return <div className={styles.panel}>No services available.</div>;
  }

  return (
    <section className={styles.tableCard}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Service</th>
            <th>Category</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Delivery</th>
            <th>Therapists</th>
            <th>Bookings</th>
            <th>Revenue</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => {
            const therapists = THERAPIST_OPTIONS.filter((therapist) =>
              service.assignedTherapistIds.includes(therapist.id),
            );
            return (
              <tr key={service.id}>
                <td>
                  <strong>{service.name}</strong>
                  <div className={styles.subtle}>{service.description ?? "No description"}</div>
                </td>
                <td>{SERVICE_CATEGORY_LABELS[service.category]}</td>
                <td>
                  {currency(service.price, service.currency)}
                  <div className={styles.subtle}>{service.taxRate}% tax</div>
                </td>
                <td>{service.defaultDuration} min</td>
                <td>{service.deliveryMethod.replace("_", " ")}</td>
                <td>
                  <div className={styles.avatarRow}>
                    {therapists.slice(0, 3).map((therapist) => (
                      <span key={therapist.id} className={styles.avatar} title={therapist.name}>
                        {getInitials(therapist.name)}
                      </span>
                    ))}
                    {therapists.length > 3 && <span className={styles.subtle}>+{therapists.length - 3}</span>}
                  </div>
                </td>
                <td>{service.totalBookings}</td>
                <td>{currency(service.totalRevenue, service.currency)}</td>
                <td>{service.status}</td>
                <td>
                  <div className={styles.actionsRow}>
                    <button type="button" className={styles.ghostButton}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={styles.ghostButton}
                      onClick={() => onToggleStatus(service.id)}
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
