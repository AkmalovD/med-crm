import {
  SERVICE_CATEGORY_LABELS,
  THERAPIST_OPTIONS,
} from "@/data/servicesData/servicesDashboardData";
import { DeliveryMethod, ServiceCategoryKey, ServiceSortBy, ServiceStatus, SortDir } from "@/types/servicesDashboardTypes";
import { DropdownSelect } from "../custom-ui/dropdown";
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
      <DropdownSelect
        triggerClassName={styles.selectInput}
        value={categoryFilter}
        onChange={(event) => onCategoryChange(event.target.value as "" | ServiceCategoryKey)}
        options={[
          { value: "", label: "All Categories" },
          ...Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => ({ value, label })),
        ]}
      />
      <DropdownSelect
        triggerClassName={styles.selectInput}
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value as "" | ServiceStatus)}
        options={[
          { value: "", label: "All Statuses" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
        ]}
      />
      <DropdownSelect
        triggerClassName={styles.selectInput}
        value={deliveryFilter}
        onChange={(event) => onDeliveryChange(event.target.value as "" | DeliveryMethod)}
        options={[
          { value: "", label: "All Delivery" },
          { value: "in_person", label: "In-person" },
          { value: "online", label: "Online" },
          { value: "both", label: "Both" },
        ]}
      />
      <DropdownSelect
        triggerClassName={styles.selectInput}
        value={therapistFilter}
        onChange={(event) => onTherapistChange(event.target.value)}
        options={[
          { value: "", label: "All Therapists" },
          ...THERAPIST_OPTIONS.map((therapist) => ({ value: therapist.id, label: therapist.name })),
        ]}
      />
      <DropdownSelect
        triggerClassName={styles.selectInput}
        value={`${sortBy}:${sortDir}`}
        onChange={(event) => {
          const [nextSortBy, nextSortDir] = event.target.value.split(":");
          onSortChange(nextSortBy as ServiceSortBy, nextSortDir as SortDir);
        }}
        options={[
          { value: "name:asc", label: "Name A-Z" },
          { value: "name:desc", label: "Name Z-A" },
          { value: "price:asc", label: "Price Low-High" },
          { value: "price:desc", label: "Price High-Low" },
          { value: "bookings:desc", label: "Most Booked" },
          { value: "createdAt:desc", label: "Newest" },
        ]}
      />
      <button className={styles.ghostButton} type="button" onClick={onClear}>
        Clear
      </button>
    </section>
  );
}
