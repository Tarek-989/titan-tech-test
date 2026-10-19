import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { useFormatters } from '@/utils/formatters';
import type { CartItem } from '../types';

function CartItemRowComponent({ item }: { item: CartItem }) {
  const { t } = useTranslation();
  const format = useFormatters();
  const hasDiscount = item.discountedTotal < item.total;

  return (
    <Stack
      component="li"
      direction="row"
      spacing={2}
      sx={{ py: 2, alignItems: { xs: 'flex-start', sm: 'center' } }}
    >
      <Box
        component="img"
        src={item.thumbnail}
        alt=""
        loading="lazy"
        sx={{
          width: 72,
          height: 72,
          flexShrink: 0,
          objectFit: 'contain',
          borderRadius: 1,
          bgcolor: 'grey.50',
        }}
      />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2 }}
        sx={{ flexGrow: 1, minWidth: 0, justifyContent: 'space-between' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Link
            component={RouterLink}
            to={`/products/${item.id}`}
            state={{ from: '/cart' }}
            underline="hover"
            color="inherit"
            variant="subtitle1"
            sx={{ fontWeight: 600, display: 'block' }}
          >
            {item.title}
          </Link>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              {t('cart.unitPrice', { price: format.currency(item.price) })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ·
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t('cart.quantity', { count: item.quantity })}
            </Typography>
            {item.discountPercentage > 0 && (
              <Chip
                size="small"
                color="error"
                variant="outlined"
                label={t('products.discount', { value: format.percent(item.discountPercentage) })}
              />
            )}
          </Stack>
        </Box>
        <Box sx={{ textAlign: { sm: 'end' }, flexShrink: 0 }}>
          <Typography sx={{ fontWeight: 700 }}>{format.currency(item.discountedTotal)}</Typography>
          {hasDiscount && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              {format.currency(item.total)}
            </Typography>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}

export const CartItemRow = memo(CartItemRowComponent);
