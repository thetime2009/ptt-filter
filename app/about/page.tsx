import { cookies } from 'next/headers';
import { translations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';
import styles from './about.module.css';

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || 'th') as Locale;
  const t = translations[locale] || translations.th;

  return (
    <div className={`${styles.container} container`}>
      <div className={styles.header}>
        <span className={styles.badge}>{t.about.badge}</span>
        <h1 className={styles.title}>{t.about.title}</h1>
        <p className={styles.subtitle}>{t.about.subtitle}</p>
      </div>

      <div className={styles.layout}>
        <div className={`${styles.card} glass`}>
          <h2 className={styles.cardTitle}>{t.about.vision}</h2>
          <p className={styles.cardText}>
            {t.about.visionText}
          </p>
        </div>

        <div className={`${styles.card} glass`}>
          <h2 className={styles.cardTitle}>{t.about.indVsAuto}</h2>
          <p className={styles.cardText}>
            {t.about.indVsAutoText}
          </p>
        </div>
      </div>

      <div className={`${styles.section} glass`}>
        <h2 className={styles.sectionTitle}>{t.about.serviceTitle}</h2>
        <div className={styles.servicesGrid}>
          <div className={styles.serviceItem}>
            <span className={styles.serviceIcon}>⚙️</span>
            <h4>{t.about.oemTitle}</h4>
            <p>{t.about.oemText}</p>
          </div>
          <div className={styles.serviceItem}>
            <span className={styles.serviceIcon}>⚡</span>
            <h4>{t.about.refurbishTitle}</h4>
            <p>{t.about.refurbishText}</p>
          </div>
          <div className={styles.serviceItem}>
            <span className={styles.serviceIcon}>🔬</span>
            <h4>{t.about.consultTitle}</h4>
            <p>{t.about.consultText}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
