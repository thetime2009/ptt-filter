'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <span className={styles.logoAccent}>PTT</span> FILTER
            </Link>
            <p className={styles.desc}>
              {t.footer.desc}
            </p>
          </div>
          
          <div className={styles.links}>
            <h4 className={styles.title}>{t.footer.quickLinks}</h4>
            <Link href="/" className={styles.link}>{t.nav.home}</Link>
            <Link href="/products" className={styles.link}>{t.nav.products}</Link>
            <Link href="/about" className={styles.link}>{t.nav.about}</Link>
            <Link href="/contact" className={styles.link}>{t.nav.contact}</Link>
          </div>

          <div className={styles.links}>
            <h4 className={styles.title}>{t.categories.title}</h4>
            <span className={styles.tag}>Air Filter</span>
            <span className={styles.tag}>Dust Collector Filter</span>
            <span className={styles.tag}>Smoke Filter</span>
            <span className={styles.tag}>Oil Filter</span>
          </div>

          <div className={styles.contact}>
            <h4 className={styles.title}>{t.footer.contactInfo}</h4>
            <p>{t.contact.email}: info@pttfilter.com</p>
            <p>{t.contact.phone}: 02-XXX-XXXX</p>
            <p>{t.footer.address}</p>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} PTT Filter Co., Ltd. {t.footer.rights}.</p>
        </div>
      </div>
    </footer>
  );
}
