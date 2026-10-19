import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

interface LoadingStateProps {
  label?: string;
  minHeight?: number | string;
}

export function LoadingState({ label, minHeight = 240 }: LoadingStateProps) {
  const { t } = useTranslation();

  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        minHeight,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress aria-hidden />
      <Typography color="text.secondary">{label ?? t('common.loading')}</Typography>
    </Box>
  );
}
