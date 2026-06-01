import Link from 'next/link';
import styles from './page.module.css';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import { translations } from '@/lib/i18n/translations';
import { Locale } from '@/lib/i18n/config';

export default async function Home() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get('locale')?.value || 'th') as Locale;
  const t = translations[locale] || translations.th;

  const categoriesRes = await db.query('SELECT * FROM categories');
  const categories = categoriesRes.rows;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>

      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={`${styles.container} container`}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>{t.hero.badge}</div>
            <h1 className={styles.title}>
              {t.hero.title}<br />
              <span className={styles.titleHighlight}>{t.hero.titleHighlight}</span>
            </h1>
            <p className={styles.description}>
              {t.hero.description}
            </p>
            <div className={styles.btnGroup}>
              <Link href="/products" className={styles.btnPrimary}>
                {t.hero.explore}
              </Link>
              <Link href="/contact" className={styles.btnSecondary}>
                {t.hero.quote}
              </Link>
            </div>

            {/* Hero Stats */}
            <div className={styles.heroStats}>
              <div className={styles.statItem}>
                <span className={styles.statNum}>{t.hero.statsOEM}</span>
                <span className={styles.statLabel}>{t.hero.statsOEM_label}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>{t.hero.statsNoMOQ}</span>
                <span className={styles.statLabel}>{t.hero.statsNoMOQ_label}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statNum}>{t.hero.statsReady}</span>
                <span className={styles.statLabel}>{t.hero.statsReady_label}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== KEY STRENGTHS ===== */}
      <section className={styles.strengthSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.whyChooseUs.title}</h2>
            <p className={styles.sectionDesc}>
              {t.whyChooseUs.desc}
            </p>
          </div>

          <div className={styles.strengthGrid}>

            <div className={styles.strengthCard}>
              <div className={styles.strengthIcon}>🎯</div>
              <h3 className={styles.strengthTitle}>{t.whyChooseUs.customTitle}</h3>
              <p className={styles.strengthDesc}>
                {t.whyChooseUs.customDesc}
              </p>
              <div className={styles.strengthTag}>{t.whyChooseUs.customTag}</div>
            </div>

            <div className={styles.strengthCard}>
              <div className={styles.strengthIcon}>∞</div>
              <h3 className={styles.strengthTitle}>{t.whyChooseUs.noMoqTitle}</h3>
              <p className={styles.strengthDesc}>
                {t.whyChooseUs.noMoqDesc}
              </p>
              <div className={styles.strengthTag}>{t.whyChooseUs.noMoqTag}</div>
            </div>

            <div className={styles.strengthCard}>
              <div className={styles.strengthIcon}>📦</div>
              <h3 className={styles.strengthTitle}>{t.whyChooseUs.readyTitle}</h3>
              <p className={styles.strengthDesc}>
                {t.whyChooseUs.readyDesc}
              </p>
              <div className={styles.strengthTag}>{t.whyChooseUs.readyTag}</div>
            </div>

            <div className={styles.strengthCard}>
              <div className={styles.strengthIcon}>✅</div>
              <h3 className={styles.strengthTitle}>{t.whyChooseUs.qcTitle}</h3>
              <p className={styles.strengthDesc}>
                {t.whyChooseUs.qcDesc}
              </p>
              <div className={styles.strengthTag}>{t.whyChooseUs.qcTag}</div>
            </div>

          </div>
        </div>
      </section>

      {/* ===== PRODUCT CATEGORIES ===== */}
      <section className={`${styles.section} ${styles.sectionAlt}`}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{t.categories.title}</h2>
            <p className={styles.sectionDesc}>
              {t.categories.desc}
            </p>
          </div>

          <div className={styles.grid}>
            {categories.map((category) => (
              <Link key={category.id} href={`/products?category=${category.slug}`} className={styles.categoryCard}>
                <div className={styles.iconWrapper}>
                  {category.icon === 'Wind' && '💨'}
                  {category.icon === 'Activity' && '🌪️'}
                  {category.icon === 'CloudSmoke' && '🔥'}
                  {category.icon === 'Droplet' && '🛢️'}
                  {category.icon === 'Layers' && '🛠️'}
                </div>
                <h3 className={styles.catTitle}>
                  {locale === 'th' ? category.name_th || category.name : category.name}
                </h3>
                <p className={styles.catDesc}>{category.description}</p>
                <span className={styles.catArrow}>{t.categories.viewProducts}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>{t.cta.title}</h2>
              <p className={styles.ctaDesc}>
                {t.cta.desc}
              </p>
            </div>
            <Link href="/contact" className={styles.ctaBtn}>
              {t.cta.button}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
