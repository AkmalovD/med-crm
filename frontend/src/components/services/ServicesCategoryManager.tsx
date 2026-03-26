import { Service, ServiceCategory } from "@/types/servicesDashboardTypes";
import styles from "./ServicesDashboardPage.module.css";

interface ServicesCategoryManagerProps {
  categories: ServiceCategory[];
  services: Service[];
}

export function ServicesCategoryManager({ categories, services }: ServicesCategoryManagerProps) {
  return (
    <section className={styles.panel}>
      <div className={styles.toolRow} style={{ justifyContent: "space-between", padding: 12 }}>
        <strong>Categories ({categories.length})</strong>
        <button type="button" className={styles.primaryButton}>
          Add Category
        </button>
      </div>
      <div className={styles.categoryList} style={{ padding: 12, paddingTop: 0 }}>
        {categories.map((category) => {
          const count = services.filter((service) => service.category === category.key).length;
          return (
            <div key={category.id} className={styles.categoryRow}>
              <div className={styles.toolRow}>
                <span className={styles.dot} style={{ background: category.color }} />
                <strong>{category.name}</strong>
                <span className={styles.subtle}>{count} services</span>
              </div>
              <div className={styles.actionsRow}>
                <button type="button" className={styles.ghostButton}>
                  Edit
                </button>
                <button type="button" className={styles.dangerButton} disabled={count > 0}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
