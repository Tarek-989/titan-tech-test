import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import i18n from '@/i18n';

export type ApiError = FetchBaseQueryError | SerializedError | undefined;

function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error;
}

function hasMessage(value: unknown): value is { message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

/** HTTP status of an RTK Query error, if it has one. */
export function getErrorStatus(error: unknown): number | undefined {
  return isFetchBaseQueryError(error) && typeof error.status === 'number'
    ? error.status
    : undefined;
}

export function isNotFoundError(error: unknown): boolean {
  return getErrorStatus(error) === 404;
}

/** Converts any RTK Query / thrown error into a human readable, localized message. */
export function getErrorMessage(error: unknown): string {
  if (isFetchBaseQueryError(error)) {
    switch (error.status) {
      case 'FETCH_ERROR':
        return i18n.t('errors.network');
      case 'TIMEOUT_ERROR':
        return i18n.t('errors.timeout');
      default:
        if (hasMessage(error.data)) return error.data.message;
        return i18n.t('errors.genericDescription');
    }
  }
  if (hasMessage(error)) return error.message;
  return i18n.t('errors.genericDescription');
}
