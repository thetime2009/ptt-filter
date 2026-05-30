'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, defaultLocale } from './config';
import { translations } from './translations';

type TranslationKeys = typeof translations.th;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationKeys;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read preference from cookie or localStorage
    const savedLocale = document.cookie
      .split('; ')
      .find((row) => row.startsWith('locale='))
      ?.split('=')[1] as Locale;

    if (savedLocale && ['th', 'en', 'zh'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
      const localSaved = localStorage.getItem('locale') as Locale;
      if (localSaved && ['th', 'en', 'zh'].includes(localSaved)) {
        setLocaleState(localSaved);
        document.cookie = `locale=${localSaved}; path=/; max-age=31536000`;
      }
    }
    setMounted(true);
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
  };

  // Safe fallback if not mounted yet (to avoid hydration mismatch)
  const t = translations[locale] || translations[defaultLocale];

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
