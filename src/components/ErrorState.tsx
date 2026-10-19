import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { StateMessage } from './StateMessage';

interface ErrorStateProps {
  title?: string;
  /** Raw error (e.g. from RTK Query); converted to a readable message. */
  error?: unknown;
  /** Explicit message, takes precedence over `error`. */
  message?: string;
  onRetry?: () => void;
  retrying?: boolean;
  extraAction?: ReactNode;
}

export function ErrorState({
  title,
  error,
  message,
  onRetry,
  retrying = false,
  extraAction,
}: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <StateMessage
      role="alert"
      icon={<ErrorOutlineIcon color="error" sx={{ fontSize: 56 }} />}
      title={title ?? t('errors.genericTitle')}
      description={message ?? getErrorMessage(error)}
      action={
        (onRetry || extraAction) && (
          <>
            {onRetry && (
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={onRetry}
                loading={retrying}
              >
                {t('common.retry')}
              </Button>
            )}
            {extraAction}
          </>
        )
      }
    />
  );
}
