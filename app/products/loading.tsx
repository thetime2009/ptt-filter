import styles from './loading.module.css';

export default function ProductsLoading() {
  return (
    <div className={`${styles.container} container`}>
      <div className={`${styles.title} ${styles.skeleton}`}></div>
      <div className={`${styles.desc} ${styles.skeleton}`}></div>

      <div className={styles.layout}>
        {/* Sidebar Filters Skeleton */}
        <aside className={styles.sidebar}>
          <div className={`${styles.sidebarGroup} glass`}>
            <div className={`${styles.groupTitle} ${styles.skeleton}`}></div>
            <div className={styles.filterList}>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`${styles.filterItem} ${styles.skeleton}`}></div>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid Skeleton */}
        <main style={{ flex: 1 }}>
          <div className={styles.productsGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`${styles.productCard} glass`}>
                <div className={`${styles.imagePlaceholder} ${styles.skeleton}`}></div>
                <div className={styles.productContent}>
                  <div className={`${styles.catBadge} ${styles.skeleton}`}></div>
                  <div className={`${styles.prodTitle} ${styles.skeleton}`}></div>
                  <div className={`${styles.prodDesc} ${styles.skeleton}`}></div>
                  <div className={`${styles.prodDescShort} ${styles.skeleton}`}></div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
