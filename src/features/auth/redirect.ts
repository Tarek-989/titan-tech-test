export const DEFAULT_AUTHENTICATED_PATH = '/products';

/**
 * Returns a safe in-app path from the `?redirect=` param. Only same-origin
 * absolute paths are allowed, which prevents open redirects (`//evil.com`).
 */
export function getSafeRedirect(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.startsWith('/\\')) {
    return DEFAULT_AUTHENTICATED_PATH;
  }
  return value;
}
