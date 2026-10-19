import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useFormatters } from '@/utils/formatters';

interface PaginationBarProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function PaginationBar({
  page,
  pageSize,
  total,
  onPageChange,
  disabled,
}: PaginationBarProps) {
  const { t } = useTranslation();
  const format = useFormatters();
  const pageCount = Math.ceil(total / pageSize);

  if (total === 0) return null;

  const from = Math.min((page - 1) * pageSize + 1, total);
  const to = Math.min(page * pageSize, total);

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ alignItems: 'center', justifyContent: 'space-between', mt: 3 }}
    >
      <Typography variant="body2" color="text.secondary">
        {t('common.showingRange', {
          from: format.number(from),
          to: format.number(to),
          total: format.number(total),
        })}
      </Typography>
      {pageCount > 1 && (
        <Pagination
          count={pageCount}
          page={Math.min(page, pageCount)}
          disabled={disabled}
          color="primary"
          shape="rounded"
          siblingCount={1}
          onChange={(_, nextPage) => {
            onPageChange(nextPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </Stack>
  );
}
