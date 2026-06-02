import styles from './loading.module.css';

export default function ProductDetailLoading() {
  return (
    <div className={`${styles.container} container`}>
      <div className={`${styles.backBtn} ${styles.skeleton}`}></div>

      <div className={styles.layout}>
        {/* Product Media Skeleton */}
        <div className={styles.imageArea}>
          <div className={`${styles.mainImagePlaceholder} ${styles.skeleton}`}></div>
          <div className={styles.thumbs}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`${styles.thumb} ${styles.skeleton}`}></div>
            ))}
          </div>
        </div>

        {/* Product Info Skeleton */}
        <div className={styles.infoArea}>
          <div className={`${styles.category} ${styles.skeleton}`}></div>
          <div className={`${styles.title} ${styles.skeleton}`}></div>
          <div className={`${styles.descLine} ${styles.skeleton}`}></div>
          <div className={`${styles.descLine} ${styles.skeleton}`}></div>
          <div className={`${styles.descLineShort} ${styles.skeleton}`}></div>

          <div className={styles.specsSection}>
            <div className={`${styles.specsTitle} ${styles.skeleton}`}></div>
            <div className={styles.specsTable}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={styles.specRow}>
                  <div className={`${styles.specLabel} ${styles.skeleton}`}></div>
                  <div className={`${styles.specVal} ${styles.skeleton}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
