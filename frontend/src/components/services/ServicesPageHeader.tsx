import styles from "./ServicesDashboardPage.module.css";

interface ServicesPageHeaderProps {
  activeServicesCount: string;
  activeTab: "services" | "packages" | "categories";
}

export function ServicesPageHeader({ activeServicesCount, activeTab }: ServicesPageHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <h1 className={styles.title}>Services</h1>
        <p className={styles.subtle}>Manage your services, packages, and categories.</p>
      </div>
      <div className={styles.actionsRow}>
        <span className={styles.badge}>{activeServicesCount} active services</span>
        <button className={styles.primaryButton} type="button">
          {activeTab === "packages" ? "New Package" : "Add Service"}
        </button>
      </div>
    </header>
  );
}
