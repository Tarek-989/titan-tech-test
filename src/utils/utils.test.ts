import { describe, expect, it } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  toIntlLocale,
} from './formatters';
import { getErrorMessage, getErrorStatus, isNotFoundError } from './getErrorMessage';
import { parseId } from './parseId';
import { parsePage, patchSearchParams } from './searchParams';

describe('patchSearchParams', () => {
  it('sets, replaces and removes keys without mutating the input', () => {
    const params = new URLSearchParams('q=phone&page=3&sort=price-asc');

    const next = patchSearchParams(params, { q: 'laptop', page: null, sort: '', category: 'x' });

    expect(next.toString()).toBe('q=laptop&category=x');
    expect(params.toString()).toBe('q=phone&page=3&sort=price-asc');
  });
});

describe('parsePage', () => {
  it.each([
    ['2', 2],
    [null, 1],
    ['0', 1],
    ['-4', 1],
    ['1.5', 1],
    ['abc', 1],
  ])('parses %s as %i', (value, expected) => {
    expect(parsePage(value)).toBe(expected);
  });
});

describe('parseId', () => {
  it('accepts positive integers only', () => {
    expect(parseId('42')).toBe(42);
    expect(parseId('0')).toBeNull();
    expect(parseId('abc')).toBeNull();
    expect(parseId('1e3')).toBeNull();
    expect(parseId(undefined)).toBeNull();
  });
});

describe('formatters', () => {
  it('maps app languages to Intl locales', () => {
    expect(toIntlLocale('en')).toBe('en-US');
    expect(toIntlLocale('ar')).toBe('ar-u-nu-latn');
  });

  it('formats values for English', () => {
    expect(formatCurrency(1234.5, 'en-US')).toBe('$1,234.50');
    expect(formatNumber(4.567, 'en-US')).toBe('4.57');
    expect(formatPercent(12.5, 'en-US')).toBe('12.5%');
    expect(formatDate('2025-04-30T09:41:02.053Z', 'en-US')).toBe('Apr 30, 2025');
  });

  it('keeps Latin digits for Arabic', () => {
    expect(formatNumber(1234, 'ar-u-nu-latn')).toMatch(/1.?234/);
  });

  it('returns the raw value for invalid dates', () => {
    expect(formatDate('not-a-date', 'en-US')).toBe('not-a-date');
  });
});

describe('getErrorMessage', () => {
  it('uses the API message when present', () => {
    const error = { status: 400, data: { message: 'Invalid credentials' } };
    expect(getErrorMessage(error)).toBe('Invalid credentials');
    expect(getErrorStatus(error)).toBe(400);
  });

  it('translates network and timeout errors', () => {
    expect(getErrorMessage({ status: 'FETCH_ERROR', error: 'TypeError' })).toBe(
      'Network error. Check your connection and try again.',
    );
    expect(getErrorMessage({ status: 'TIMEOUT_ERROR', error: 'timeout' })).toBe(
      'The request timed out. Please try again.',
    );
  });

  it('falls back to a generic message', () => {
    expect(getErrorMessage({ status: 500, data: '<html>' })).toBe(
      'An unexpected error occurred. Please try again.',
    );
    expect(getErrorMessage(undefined)).toBe('An unexpected error occurred. Please try again.');
  });

  it('detects not-found errors', () => {
    expect(isNotFoundError({ status: 404, data: {} })).toBe(true);
    expect(isNotFoundError({ status: 500, data: {} })).toBe(false);
  });
});
