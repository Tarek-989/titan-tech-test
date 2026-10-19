import SearchOffIcon from '@mui/icons-material/SearchOff';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Rating from '@mui/material/Rating';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { InfoList } from '@/components/InfoList';
import { PageHeader } from '@/components/PageHeader';
import { useBackLink } from '@/hooks/useBackLink';
import { useFormatters } from '@/utils/formatters';
import { isNotFoundError } from '@/utils/getErrorMessage';
import { parseId } from '@/utils/parseId';
import { PriceTag } from '../components/PriceTag';
import { ProductGallery } from '../components/ProductGallery';
import { ProductReviews } from '../components/ProductReviews';
import { StockChip } from '../components/StockChip';
import { useGetProductQuery } from '../productsApi';
import type { Product } from '../types';

export default function ProductDetailsPage() {
  const { t } = useTranslation();
  const { productId } = useParams();
  const id = parseId(productId);
  const backTo = useBackLink('/products');
  const {
    data: product,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetProductQuery(id ?? 0, {
    skip: id === null,
  });

  if (id === null || isNotFoundError(error)) {
    return (
      <>
        <PageHeader title={t('productDetails.notFoundTitle')} backTo={backTo} />
        <EmptyState
          icon={<SearchOffIcon color="disabled" sx={{ fontSize: 56 }} />}
          title={t('productDetails.notFoundTitle')}
          description={t('productDetails.notFoundDescription')}
          action={
            <Button component={Link} to="/products" variant="contained">
              {t('productDetails.backToProducts')}
            </Button>
          }
        />
      </>
    );
  }

  if (isLoading) return <ProductDetailsSkeleton />;

  if (error || !product) {
    return (
      <>
        <PageHeader title={t('products.title')} backTo={backTo} />
        <ErrorState error={error} onRetry={refetch} retrying={isFetching} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={product.title}
        subtitle={[product.brand, product.category].filter(Boolean).join(' · ')}
        backTo={backTo}
      />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <ProductGallery key={product.id} title={product.title} images={product.images} />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <ProductSummaryCard product={product} />
        </Grid>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                {t('productDetails.reviewsCount', { count: product.reviews.length })}
              </Typography>
              <ProductReviews reviews={product.reviews} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

function ProductSummaryCard({ product }: { product: Product }) {
  const { t } = useTranslation();
  const format = useFormatters();
  const { width, height, depth } = product.dimensions;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <Rating value={product.rating} precision={0.1} readOnly />
            <Typography color="text.secondary">
              {t('productDetails.ratingValue', { value: format.number(product.rating) })}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
            <PriceTag
              price={product.price}
              discountPercentage={product.discountPercentage}
              size="large"
            />
            {product.discountPercentage > 0 && (
              <Chip
                color="error"
                size="small"
                label={t('products.discount', {
                  value: format.percent(product.discountPercentage),
                })}
              />
            )}
            <StockChip stock={product.stock} />
          </Stack>

          <Typography>{product.description}</Typography>

          {product.tags.length > 0 && (
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', rowGap: 1 }}>
              {product.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" variant="outlined" />
              ))}
            </Stack>
          )}

          <Divider />

          <Typography variant="h6" component="h2">
            {t('productDetails.specifications')}
          </Typography>
          <InfoList
            items={[
              { label: t('productDetails.brand'), value: product.brand },
              { label: t('productDetails.category'), value: product.category },
              { label: t('productDetails.sku'), value: product.sku },
              { label: t('productDetails.availability'), value: product.availabilityStatus },
              { label: t('productDetails.stock'), value: format.number(product.stock) },
              {
                label: t('productDetails.minimumOrder'),
                value: format.number(product.minimumOrderQuantity),
              },
              { label: t('productDetails.weight'), value: format.number(product.weight) },
              {
                label: t('productDetails.dimensions'),
                value: [width, height, depth].map(format.number).join(' × '),
              },
              { label: t('productDetails.warranty'), value: product.warrantyInformation },
              { label: t('productDetails.shipping'), value: product.shippingInformation },
              { label: t('productDetails.returnPolicy'), value: product.returnPolicy },
            ]}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

function ProductDetailsSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton width={90} height={32} />
      <Skeleton width="50%" height={44} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Skeleton variant="rounded" sx={{ aspectRatio: '1 / 1', height: 'auto' }} />
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Skeleton width="30%" height={32} />
          <Skeleton width="40%" height={56} />
          <Skeleton height={24} />
          <Skeleton height={24} />
          <Skeleton width="80%" height={24} />
          <Skeleton variant="rounded" height={220} sx={{ mt: 2 }} />
        </Grid>
      </Grid>
    </div>
  );
}
