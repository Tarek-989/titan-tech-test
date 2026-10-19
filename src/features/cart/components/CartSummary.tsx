import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormatters } from '@/utils/formatters';
import type { Cart } from '../types';

function SummaryRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: ReactNode;
  strong?: boolean;
}) {
  const variant = strong ? 'h6' : 'body1';
  return (
    <Stack
      direction="row"
      sx={{
        justifyContent: 'space-between',
        gap: 2,
        ...(strong && { borderTop: 1, borderColor: 'divider', pt: 1.5 }),
      }}
    >
      <Typography
        component="dt"
        variant={variant}
        color={strong ? 'text.primary' : 'text.secondary'}
      >
        {label}
      </Typography>
      <Typography component="dd" variant={variant} sx={{ m: 0, fontWeight: strong ? 700 : 500 }}>
        {value}
      </Typography>
    </Stack>
  );
}

export function CartSummary({ cart }: { cart: Cart }) {
  const { t } = useTranslation();
  const format = useFormatters();
  const savings = cart.total - cart.discountedTotal;

  return (
    <Card sx={{ position: { md: 'sticky' }, top: { md: 88 } }}>
      <CardContent>
        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          {t('cart.summary')}
        </Typography>
        <Stack component="dl" spacing={1.5} sx={{ m: 0 }}>
          <SummaryRow label={t('cart.totalProducts')} value={format.number(cart.totalProducts)} />
          <SummaryRow label={t('cart.totalQuantity')} value={format.number(cart.totalQuantity)} />
          <SummaryRow label={t('cart.subtotal')} value={format.currency(cart.total)} />
          <SummaryRow
            label={t('cart.discount')}
            value={
              <Typography component="span" color="success.main" sx={{ fontWeight: 'inherit' }}>
                {savings > 0 ? `-${format.currency(savings)}` : format.currency(0)}
              </Typography>
            }
          />
          <SummaryRow
            label={t('cart.total')}
            value={format.currency(cart.discountedTotal)}
            strong
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
