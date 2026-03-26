import {
  SERVICE_CATEGORY_LABELS,
  THERAPIST_OPTIONS,
} from "@/data/servicesData/servicesDashboardData";
import { DeliveryMethod, ServiceCategoryKey, ServiceSortBy, ServiceStatus, SortDir } from "@/types/servicesDashboardTypes";
import styles from "./ServicesDashboardPage.module.css";

interface ServicesFilterBarProps {
  searchInput: string;
  categoryFilter: "" | ServiceCategoryKey;
  statusFilter: "" | ServiceStatus;
  deliveryFilter: "" | DeliveryMethod;
  therapistFilter: string;
  sortBy: ServiceSortBy;
  sortDir: SortDir;
  onSearchInputChange: (value: string) => void;
  onCategoryChange: (value: "" | ServiceCategoryKey) => void;
  onStatusChange: (value: "" | ServiceStatus) => void;
  onDeliveryChange: (value: "" | DeliveryMethod) => void;
  onTherapistChange: (value: string) => void;
  onSortChange: (sortBy: ServiceSortBy, sortDir: SortDir) => void;
  onClear: () => void;
}

export function ServicesFilterBar(props: ServicesFilterBarProps) {
  const {
    searchInput,
    categoryFilter,
    statusFilter,
    deliveryFilter,
    therapistFilter,
    sortBy,
    sortDir,
    onSearchInputChange,
    onCategoryChange,
    onStatusChange,
    onDeliveryChange,
    onTherapistChange,
    onSortChange,
    onClear,
  } = props;

  return (
    <section className={styles.filterBar}>
      <input
        className={styles.searchInput}
        placeholder="Search services..."
        value={searchInput}
        onChange={(event) => onSearchInputChange(event.target.value)}
      />
      <select
        className={styles.selectInput}
        value={categoryFilter}
        onChange={(event) => onCategoryChange(event.target.value as "" | ServiceCategoryKey)}
      >
        <option value="">All Categories</option>
        {Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <select
        className={styles.selectInput}
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value as "" | ServiceStatus)}
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <select
        className={styles.selectInput}
        value={deliveryFilter}
        onChange={(event) => onDeliveryChange(event.target.value as "" | DeliveryMethod)}
      >
        <option value="">All Delivery</option>
        <option value="in_person">In-person</option>
        <option value="online">Online</option>
        <option value="both">Both</option>
      </select>
      <select
        className={styles.selectInput}
        value={therapistFilter}
        onChange={(event) => onTherapistChange(event.target.value)}
      >
        <option value="">All Therapists</option>
        {THERAPIST_OPTIONS.map((therapist) => (
          <option key={therapist.id} value={therapist.id}>
            {therapist.name}
          </option>
        ))}
      </select>
      <select
        className={styles.selectInput}
        value={`${sortBy}:${sortDir}`}
        onChange={(event) => {
          const [nextSortBy, nextSortDir] = event.target.value.split(":");
          onSortChange(nextSortBy as ServiceSortBy, nextSortDir as SortDir);
        }}
      >
        <option value="name:asc">Name A-Z</option>
        <option value="name:desc">Name Z-A</option>
        <option value="price:asc">Price Low-High</option>
        <option value="price:desc">Price High-Low</option>
        <option value="bookings:desc">Most Booked</option>
        <option value="createdAt:desc">Newest</option>
      </select>
      <button className={styles.ghostButton} type="button" onClick={onClear}>
        Clear
      </button>
    </section>
  );
}
