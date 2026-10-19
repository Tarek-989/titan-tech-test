import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { usePaginationParams } from '@/hooks/usePaginationParams';
import { patchSearchParams } from '@/utils/searchParams';
import type { UserListArgs } from '../types';

export const USERS_PAGE_SIZE = 12;

/** Users list search term and page, stored in the URL (`?q=&page=`). */
export function useUserFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, setPage, limit, skip } = usePaginationParams(USERS_PAGE_SIZE);
  const q = searchParams.get('q') ?? '';

  const queryArgs = useMemo<UserListArgs>(() => ({ q, limit, skip }), [q, limit, skip]);

  return {
    q,
    page,
    queryArgs,
    setPage,
    // A new search starts again from the first page.
    setSearch: (value: string) =>
      setSearchParams((prev) => patchSearchParams(prev, { q: value, page: null })),
  };
}
