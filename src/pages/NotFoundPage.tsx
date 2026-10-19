import SearchOffIcon from '@mui/icons-material/SearchOff';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { EmptyState } from '@/components/EmptyState';

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={<SearchOffIcon color="disabled" sx={{ fontSize: 56 }} />}
      title={t('errors.notFoundTitle')}
      description={t('errors.notFoundDescription')}
      action={
        <Button component={Link} to="/" variant="contained">
          {t('common.goHome')}
        </Button>
      }
    />
  );
}
