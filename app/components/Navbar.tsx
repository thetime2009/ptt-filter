'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Locale, localeFlags, localeNames } from '@/lib/i18n/config';

interface NavbarProps {
  session: any;
  signOutAction: () => Promise<void>;
}

export default function Navbar({ session, signOutAction }: NavbarProps) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLanguage();

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    await signOutAction();
  };

  return (
    <header className={`${styles.header} glass`}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoAccent}>PTT</span> FILTER
        </Link>
        
        <nav className={styles.nav}>
          <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>
            {t.nav.home}
          </Link>
          <Link href="/products" className={`${styles.link} ${pathname.startsWith('/products') ? styles.active : ''}`}>
            {t.nav.products}
          </Link>
          <Link href="/about" className={`${styles.link} ${pathname === '/about' ? styles.active : ''}`}>
            {t.nav.about}
          </Link>
          <Link href="/contact" className={`${styles.link} ${pathname === '/contact' ? styles.active : ''}`}>
            {t.nav.contact}
          </Link>

          {session ? (
            <div className={styles.adminGroup}>
              <Link href="/admin" className={`${styles.adminLink} ${pathname.startsWith('/admin') ? styles.activeAdmin : ''}`}>
                {t.nav.admin}
              </Link>
              <form onSubmit={handleSignOut}>
                <button type="submit" className={styles.logoutBtn}>
                  {t.nav.logout}
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className={styles.loginBtn}>
              {t.nav.login}
            </Link>
          )}

          {/* Language Switcher */}
          <div className={styles.langSwitcher}>
            {(['th', 'en', 'zh'] as Locale[]).map((lang) => (
              <button
                key={lang}
                type="button"
                className={`${styles.langBtn} ${locale === lang ? styles.langActive : ''}`}
                onClick={() => setLocale(lang)}
              >
                <span>{localeFlags[lang]}</span>
                <span>{localeNames[lang]}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
