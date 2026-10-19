import FilterAltOffOutlinedIcon from '@mui/icons-material/FilterAltOffOutlined';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { SearchField } from '@/components/SearchField';
import { PRODUCT_SORT_OPTIONS, type ProductSortOption } from '../hooks/useProductFilters';
import { useGetCategoriesQuery } from '../productsApi';

interface ProductFiltersProps {
  q: string;
  category: string;
  sort: ProductSortOption | '';
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSortChange: (value: ProductSortOption | '') => void;
  onClear: () => void;
}

export function ProductFilters({
  q,
  category,
  sort,
  hasActiveFilters,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onClear,
}: ProductFiltersProps) {
  const { t } = useTranslation();
  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Grid container spacing={2} sx={{ alignItems: 'center' }}>
        <Grid size={{ xs: 12, md: hasActiveFilters ? 4 : 6 }}>
          <SearchField
            value={q}
            onSearch={onSearchChange}
            placeholder={t('products.searchPlaceholder')}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            select
            fullWidth
            label={t('products.category')}
            value={categories.length > 0 ? category : ''}
            onChange={(event) => onCategoryChange(event.target.value)}
            disabled={isLoading}
            error={isError}
            helperText={isError ? t('products.categoriesError') : undefined}
            slotProps={{ inputLabel: { shrink: true }, select: { displayEmpty: true } }}
          >
            <MenuItem value="">{t('products.allCategories')}</MenuItem>
            {categories.map((item) => (
              <MenuItem key={item.slug} value={item.slug}>
                {item.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            select
            fullWidth
            label={t('products.sortBy')}
            value={sort}
            onChange={(event) => onSortChange(event.target.value as ProductSortOption | '')}
            slotProps={{ inputLabel: { shrink: true }, select: { displayEmpty: true } }}
          >
            <MenuItem value="">{t('products.sort.default')}</MenuItem>
            {PRODUCT_SORT_OPTIONS.map((option) => (
              <MenuItem key={option} value={option}>
                {t(`products.sort.${option}`)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {hasActiveFilters && (
          <Grid size={{ xs: 12, md: 2 }}>
            <Button fullWidth startIcon={<FilterAltOffOutlinedIcon />} onClick={onClear}>
              {t('products.clearFilters')}
            </Button>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}
