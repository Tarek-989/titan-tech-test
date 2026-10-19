import { useLocation } from 'react-router';

/** State that list pages pass to detail links so "Back" restores filters and page. */
export interface BackLinkState {
  from: string;
}

/** Returns the list URL the user came from, or `fallback` when the page was opened directly. */
export function useBackLink(fallback: string): string {
  const { state } = useLocation();
  const from = (state as Partial<BackLinkState> | null)?.from;
  return typeof from === 'string' && from.startsWith('/') ? from : fallback;
}
