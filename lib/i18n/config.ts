export type Locale = 'th' | 'en' | 'zh';

export const locales: Locale[] = ['th', 'en', 'zh'];

export const localeNames: Record<Locale, string> = {
  th: 'ไทย',
  en: 'EN',
  zh: '中文',
};

export const localeFlags: Record<Locale, string> = {
  th: '🇹🇭',
  en: '🇺🇸',
  zh: '🇨🇳',
};

export const defaultLocale: Locale = 'th';
