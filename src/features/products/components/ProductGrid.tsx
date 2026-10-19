import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import { useLocation } from 'react-router';
import type { ProductSummary } from '../types';
import { ProductCard } from './ProductCard';

const ITEM_SIZE = { xs: 12, sm: 6, lg: 4, xl: 3 };

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  const { pathname, search } = useLocation();
  const from = `${pathname}${search}`;

  return (
    <Grid container spacing={2}>
      {products.map((product) => (
        <Grid key={product.id} size={ITEM_SIZE}>
          <ProductCard product={product} from={from} />
        </Grid>
      ))}
    </Grid>
  );
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Grid container spacing={2} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <Grid key={index} size={ITEM_SIZE}>
          <Card>
            <Skeleton variant="rectangular" sx={{ aspectRatio: '4 / 3', height: 'auto' }} />
            <CardContent>
              <Skeleton width="40%" />
              <Skeleton width="90%" height={28} />
              <Skeleton width="60%" />
              <Skeleton width="35%" height={32} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
