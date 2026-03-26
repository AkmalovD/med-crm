import {
  SERVICE_CATEGORY_LABELS,
  SERVICE_STATUS_LABELS,
  THERAPIST_OPTIONS,
} from "@/data/servicesData/servicesDashboardData";
import { Service } from "@/types/servicesDashboardTypes";
import { currency, getInitials } from "@/utils/servicesDashboardUtils";
import styles from "./ServicesDashboardPage.module.css";

interface ServicesGridProps {
  services: Service[];
  onToggleStatus: (id: string) => void;
}

export function ServicesGrid({ services, onToggleStatus }: ServicesGridProps) {
  if (services.length === 0) {
    return <div className={styles.panel}>No services found for your filters.</div>;
  }

  return (
    <section className={styles.grid}>
      {services.map((service) => {
        const therapists = THERAPIST_OPTIONS.filter((therapist) =>
          service.assignedTherapistIds.includes(therapist.id),
        );
        return (
          <article key={service.id} className={styles.serviceCard}>
            <div className={styles.serviceColorBar} style={{ background: service.color }} />
            <div className={styles.serviceCardBody}>
              <div className={styles.serviceMeta}>
                <span className={styles.subtle}>{SERVICE_CATEGORY_LABELS[service.category]}</span>
                <span
                  className={`${styles.statusPill} ${
                    service.status === "active" ? styles.statusActive : styles.statusInactive
                  }`}
                >
                  {SERVICE_STATUS_LABELS[service.status]}
                </span>
              </div>
              <h3 className={styles.serviceTitle}>{service.name}</h3>
              <p className={styles.serviceDescription}>{service.description ?? "No description provided."}</p>
              <div className={styles.subtle}>
                {service.defaultDuration} min • {service.deliveryMethod.replace("_", " ")}
              </div>
              <div className={styles.subtle}>
                {currency(service.price, service.currency)} • {service.taxRate}% tax
              </div>
              <div className={styles.avatarRow}>
                {therapists.slice(0, 3).map((therapist) => (
                  <span key={therapist.id} className={styles.avatar} title={therapist.name}>
                    {getInitials(therapist.name)}
                  </span>
                ))}
                {therapists.length > 3 && <span className={styles.subtle}>+{therapists.length - 3}</span>}
              </div>
              <div className={styles.subtle}>
                {service.totalBookings} bookings • {currency(service.totalRevenue, service.currency)} revenue
              </div>
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
                <button type="button" className={styles.dangerButton} disabled={service.isDefault}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
