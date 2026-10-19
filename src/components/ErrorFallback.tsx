import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { ErrorState } from './ErrorState';

interface ErrorFallbackProps {
  onReset?: () => void;
}

/** Shown when rendering crashes (error boundary or router error element). */
export function ErrorFallback({ onReset }: ErrorFallbackProps) {
  const { t } = useTranslation();

  return (
    <ErrorState
      message={t('errors.genericDescription')}
      onRetry={onReset}
      extraAction={
        <Button variant="outlined" onClick={() => window.location.reload()}>
          {t('common.reload')}
        </Button>
      }
    />
  );
}
