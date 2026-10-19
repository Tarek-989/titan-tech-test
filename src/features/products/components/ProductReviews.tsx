import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import { useFormatters } from '@/utils/formatters';
import type { ProductReview } from '../types';

export function ProductReviews({ reviews }: { reviews: ProductReview[] }) {
  const { t } = useTranslation();
  const format = useFormatters();

  if (reviews.length === 0) {
    return <Typography color="text.secondary">{t('productDetails.noReviews')}</Typography>;
  }

  return (
    <Stack component="ul" spacing={2} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {reviews.map((review, index) => (
        <Fragment key={`${review.reviewerEmail}-${index}`}>
          {index > 0 && <Divider component="li" aria-hidden />}
          <Stack component="li" direction="row" spacing={2}>
            <Avatar sx={{ bgcolor: 'secondary.main' }}>{review.reviewerName.charAt(0)}</Avatar>
            <div>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="subtitle2">{review.reviewerName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {format.date(review.date)}
                </Typography>
              </Stack>
              <Rating value={review.rating} size="small" readOnly />
              <Typography variant="body2">{review.comment}</Typography>
            </div>
          </Stack>
        </Fragment>
      ))}
    </Stack>
  );
}
