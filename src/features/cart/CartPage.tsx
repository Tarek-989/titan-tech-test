import RemoveShoppingCartOutlinedIcon from '@mui/icons-material/RemoveShoppingCartOutlined';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { useAppSelector } from '@/app/hooks';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { PageHeader } from '@/components/PageHeader';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useGetUserCartsQuery } from './cartApi';
import { CartItemRow } from './components/CartItemRow';
import { CartSummary } from './components/CartSummary';
import type { Cart } from './types';

export default function CartPage() {
  const { t } = useTranslation();
  // Rendered behind ProtectedRoute, so a user is always present.
  const user = useAppSelector(selectCurrentUser);
  const { data, error, isLoading, isFetching, refetch } = useGetUserCartsQuery(user?.id ?? 0, {
    skip: !user,
  });

  const header = (
    <PageHeader
      title={t('cart.title')}
      subtitle={user && t('cart.subtitle', { name: `${user.firstName} ${user.lastName}` })}
    />
  );

  if (isLoading) {
    return (
      <>
        {header}
        <CartSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        {header}
        <ErrorState error={error} onRetry={refetch} retrying={isFetching} />
      </>
    );
  }

  const carts = data?.carts.filter((cart) => cart.products.length > 0) ?? [];

  if (carts.length === 0) {
    return (
      <>
        {header}
        <EmptyState
          icon={<RemoveShoppingCartOutlinedIcon color="disabled" sx={{ fontSize: 56 }} />}
          title={t('cart.emptyTitle')}
          description={t('cart.emptyDescription')}
          action={
            <Button component={Link} to="/products" variant="contained">
              {t('cart.browseProducts')}
            </Button>
          }
        />
      </>
    );
  }

  return (
    <>
      {header}
      <Stack spacing={4}>
        {carts.map((cart) => (
          <CartView key={cart.id} cart={cart} showCartNumber={carts.length > 1} />
        ))}
      </Stack>
    </>
  );
}

function CartView({ cart, showCartNumber }: { cart: Cart; showCartNumber: boolean }) {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3} sx={{ alignItems: 'flex-start' }}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2">
              {showCartNumber
                ? t('cart.cartNumber', { id: cart.id })
                : t('cart.items', { count: cart.totalProducts })}
            </Typography>
            <Stack component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
              {cart.products.map((item, index) => (
                <Fragment key={`${item.id}-${index}`}>
                  {index > 0 && <Divider component="li" aria-hidden />}
                  <CartItemRow item={item} />
                </Fragment>
              ))}
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <CartSummary cart={cart} />
      </Grid>
    </Grid>
  );
}

function CartSkeleton() {
  return (
    <Grid container spacing={3} aria-hidden>
      <Grid size={{ xs: 12, md: 8 }}>
        <Card>
          <CardContent>
            <Skeleton width="30%" height={32} />
            {Array.from({ length: 4 }, (_, index) => (
              <Stack key={index} direction="row" spacing={2} sx={{ py: 2 }}>
                <Skeleton variant="rounded" width={72} height={72} />
                <Stack sx={{ flexGrow: 1 }}>
                  <Skeleton width="60%" height={28} />
                  <Skeleton width="40%" />
                </Stack>
                <Skeleton width={80} height={28} />
              </Stack>
            ))}
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Skeleton variant="rounded" height={260} />
      </Grid>
    </Grid>
  );
}
