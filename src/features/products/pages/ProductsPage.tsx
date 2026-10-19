import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { PageHeader } from '@/components/PageHeader';
import { PaginationBar } from '@/components/PaginationBar';
import { ProductFilters } from '../components/ProductFilters';
import { ProductGrid, ProductGridSkeleton } from '../components/ProductGrid';
import { PRODUCTS_PAGE_SIZE, useProductFilters } from '../hooks/useProductFilters';
import { useGetProductsQuery } from '../productsApi';

export default function ProductsPage() {
  const { t } = useTranslation();
  const filters = useProductFilters();
  // While new args load, `data` keeps the previous page so the grid doesn't flash empty.
  const { data, error, isLoading, isFetching, isError, refetch } = useGetProductsQuery(
    filters.queryArgs,
  );

  let content: ReactNode;
  if (isLoading) {
    content = <ProductGridSkeleton />;
  } else if (isError) {
    content = <ErrorState error={error} onRetry={refetch} retrying={isFetching} />;
  } else if (!data || data.total === 0) {
    content = (
      <EmptyState
        title={t('products.emptyTitle')}
        description={t('products.emptyDescription')}
        action={
          filters.hasActiveFilters && (
            <Button variant="contained" onClick={filters.clearFilters}>
              {t('products.clearFilters')}
            </Button>
          )
        }
      />
    );
  } else if (data.products.length === 0) {
    content = (
      <EmptyState
        title={t('common.pageOutOfRangeTitle')}
        description={t('common.pageOutOfRangeDescription')}
        action={
          <Button variant="contained" onClick={() => filters.setPage(1)}>
            {t('common.goToFirstPage')}
          </Button>
        }
      />
    );
  } else {
    content = (
      <>
        <Box
          aria-busy={isFetching}
          sx={{ opacity: isFetching ? 0.55 : 1, transition: 'opacity 150ms ease' }}
        >
          <ProductGrid products={data.products} />
        </Box>
        <PaginationBar
          page={filters.page}
          pageSize={PRODUCTS_PAGE_SIZE}
          total={data.total}
          onPageChange={filters.setPage}
          disabled={isFetching}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t('products.title')}
        subtitle={data ? t('products.count', { count: data.total }) : t('products.subtitle')}
      />
      <ProductFilters
        q={filters.q}
        category={filters.category}
        sort={filters.sort}
        hasActiveFilters={filters.hasActiveFilters}
        onSearchChange={filters.setSearch}
        onCategoryChange={filters.setCategory}
        onSortChange={filters.setSort}
        onClear={filters.clearFilters}
      />
      <Box sx={{ height: 4, mb: 2 }}>
        {isFetching && !isLoading && <LinearProgress aria-label={t('common.loading')} />}
      </Box>
      {content}
    </>
  );
}
