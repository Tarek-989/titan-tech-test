import { useCallback } from 'react';
import { useSearchParams } from 'react-router';
import { parsePage, patchSearchParams } from '@/utils/searchParams';

/** Page number stored in the `?page=` URL param, converted to DummyJSON's limit/skip. */
export function usePaginationParams(pageSize: number) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parsePage(searchParams.get('page'));

  const setPage = useCallback(
    (nextPage: number) => {
      setSearchParams((prev) => patchSearchParams(prev, { page: nextPage > 1 ? nextPage : null }));
    },
    [setSearchParams],
  );

  return { page, setPage, limit: pageSize, skip: (page - 1) * pageSize };
}
