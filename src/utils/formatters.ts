import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Maps an app language to an Intl locale. Arabic keeps Latin digits so numbers
 * stay consistent with MUI components (pagination, inputs) that always render them.
 */
export function toIntlLocale(language: string): string {
  return language.startsWith('ar') ? 'ar-u-nu-latn' : 'en-US';
}

export function formatCurrency(value: number, locale: string, currency = 'USD'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
}

export function formatNumber(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value);
}

/** `value` is a percentage (e.g. 12.5 means 12.5%). */
export function formatPercent(value: number, locale: string): string {
  return new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2 }).format(
    value / 100,
  );
}

export function formatDate(value: string | Date, locale: string): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date);
}

/** Formatters bound to the active UI language. */
export function useFormatters() {
  const { i18n } = useTranslation();
  const locale = toIntlLocale(i18n.resolvedLanguage ?? i18n.language);

  return useMemo(
    () => ({
      locale,
      currency: (value: number) => formatCurrency(value, locale),
      number: (value: number) => formatNumber(value, locale),
      percent: (value: number) => formatPercent(value, locale),
      date: (value: string | Date) => formatDate(value, locale),
    }),
    [locale],
  );
}
