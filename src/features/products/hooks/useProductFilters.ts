import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import type { SortOrder } from '@/api/types';
import { usePaginationParams } from '@/hooks/usePaginationParams';
import { patchSearchParams, type SearchParamsPatch } from '@/utils/searchParams';
import type { ProductListArgs, ProductSortField } from '../types';

export const PRODUCTS_PAGE_SIZE = 12;

export const PRODUCT_SORT_OPTIONS = [
  'price-asc',
  'price-desc',
  'rating-desc',
  'title-asc',
  'title-desc',
] as const;

export type ProductSortOption = (typeof PRODUCT_SORT_OPTIONS)[number];

export function parseSortOption(value: string | null): ProductSortOption | '' {
  return PRODUCT_SORT_OPTIONS.find((option) => option === value) ?? '';
}

function toSortArgs(sort: ProductSortOption | ''): Pick<ProductListArgs, 'sortBy' | 'order'> {
  if (!sort) return {};
  const [sortBy, order] = sort.split('-') as [ProductSortField, SortOrder];
  return { sortBy, order };
}

/**
 * Product list filters stored in the URL (`?q=&category=&sort=&page=`), so the
 * view is shareable and works with the browser back button.
 */
export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { page, setPage, limit, skip } = usePaginationParams(PRODUCTS_PAGE_SIZE);

  const q = searchParams.get('q') ?? '';
  const category = searchParams.get('category') ?? '';
  const sort = parseSortOption(searchParams.get('sort'));

  // Changing any filter starts again from the first page.
  const updateFilters = useCallback(
    (patch: SearchParamsPatch) =>
      setSearchParams((prev) => patchSearchParams(prev, { ...patch, page: null })),
    [setSearchParams],
  );

  const queryArgs = useMemo<ProductListArgs>(
    () => ({ q, category, ...toSortArgs(sort), limit, skip }),
    [q, category, sort, limit, skip],
  );

  return {
    q,
    category,
    sort,
    page,
    queryArgs,
    hasActiveFilters: Boolean(q || category || sort),
    setPage,
    setSearch: (value: string) => updateFilters({ q: value }),
    setCategory: (value: string) => updateFilters({ category: value }),
    setSort: (value: ProductSortOption | '') => updateFilters({ sort: value }),
    clearFilters: () => updateFilters({ q: null, category: null, sort: null }),
  };
}
