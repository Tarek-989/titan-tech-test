import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import { getStockLevel } from '../pricing';

const COLORS = { in: 'success', low: 'warning', out: 'error' } as const;

export function StockChip({ stock }: { stock: number }) {
  const { t } = useTranslation();
  const level = getStockLevel(stock);

  const label =
    level === 'out'
      ? t('products.outOfStock')
      : level === 'low'
        ? t('products.lowStock', { count: stock })
        : t('products.inStock');

  return <Chip size="small" variant="outlined" color={COLORS[level]} label={label} />;
}
