import Stack from '@mui/material/Stack';
import Typography, { type TypographyProps } from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useFormatters } from '@/utils/formatters';
import { getDiscountedPrice } from '../pricing';

interface PriceTagProps {
  price: number;
  discountPercentage: number;
  size?: 'medium' | 'large';
}

const VARIANTS: Record<NonNullable<PriceTagProps['size']>, TypographyProps['variant']> = {
  medium: 'h6',
  large: 'h4',
};

/** Final price with the original price struck through when there is a discount. */
export function PriceTag({ price, discountPercentage, size = 'medium' }: PriceTagProps) {
  const { t } = useTranslation();
  const format = useFormatters();
  const finalPrice = getDiscountedPrice(price, discountPercentage);
  const hasDiscount = finalPrice < price;

  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
      <Typography variant={VARIANTS[size]} component="p" color="primary" sx={{ fontWeight: 700 }}>
        {format.currency(finalPrice)}
      </Typography>
      {hasDiscount && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textDecoration: 'line-through' }}
          aria-label={t('products.originalPrice', { price: format.currency(price) })}
        >
          {format.currency(price)}
        </Typography>
      )}
    </Stack>
  );
}
