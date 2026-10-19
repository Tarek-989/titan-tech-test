import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useFormatters } from '@/utils/formatters';
import type { ProductSummary } from '../types';
import { PriceTag } from './PriceTag';
import { StockChip } from './StockChip';

interface ProductCardProps {
  product: ProductSummary;
  /** List URL (with filters) the details page links back to. */
  from: string;
}

function ProductCardComponent({ product, from }: ProductCardProps) {
  const { t } = useTranslation();
  const format = useFormatters();

  return (
    <Card component="article" sx={{ height: '100%' }}>
      <CardActionArea
        component={Link}
        to={`/products/${product.id}`}
        state={{ from }}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box sx={{ position: 'relative', aspectRatio: '4 / 3', bgcolor: 'grey.50' }}>
          <Box
            component="img"
            src={product.thumbnail}
            alt={product.title}
            loading="lazy"
            decoding="async"
            sx={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
          />
          {product.discountPercentage > 0 && (
            <Chip
              size="small"
              color="error"
              label={t('products.discount', { value: format.percent(product.discountPercentage) })}
              sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 600 }}
            />
          )}
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
            {product.brand ?? product.category.replaceAll('-', ' ')}
          </Typography>
          <Typography
            variant="subtitle1"
            component="h2"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.title}
          </Typography>
          <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
            <Rating value={product.rating} precision={0.1} size="small" readOnly />
            <Typography variant="caption" color="text.secondary">
              {format.number(product.rating)}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 'auto', pt: 1, alignItems: 'center', justifyContent: 'space-between' }}
          >
            <PriceTag price={product.price} discountPercentage={product.discountPercentage} />
            <StockChip stock={product.stock} />
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

/** Memoized: cards only re-render when their product (or back link) changes. */
export const ProductCard = memo(ProductCardComponent);
