'use client';

import { useState } from 'react';
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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async (e: React.FormEvent) => {
    e.preventDefault();
    await signOutAction();
  };

  return (
    <header className={`${styles.header} glass`}>
      <div className={`${styles.container} container`}>
        <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoAccent}>PTTS-</span>FILTER
        </Link>
        
        {/* Mobile Hamburger Toggle */}
        <button 
          className={styles.menuBtn} 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: menuOpen ? 0 : 1 }}></span>
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
        </button>
        
        <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`} onClick={() => setMenuOpen(false)}>
          <Link href="/" className={`${styles.link} ${pathname === '/' ? styles.active : ''}`}>
            {t.nav.home}
          </Link>
          <Link href="/products" className={`${styles.link} ${pathname.startsWith('/products') ? styles.active : ''}`}>
            {t.nav.products}
          </Link>
          <Link href="/gallery" className={`${styles.link} ${pathname.startsWith('/gallery') ? styles.active : ''}`}>
            {t.nav.gallery}
          </Link>
          <Link href="/custom" className={`${styles.link} ${pathname === '/custom' ? styles.active : ''}`}>
            {t.nav.custom}
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
