import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, type To } from 'react-router';

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  /** Renders a back link to this location. */
  backTo?: To;
}

export function PageHeader({ title, subtitle, actions, backTo }: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <Stack spacing={1} sx={{ mb: 3 }}>
      {backTo && (
        <div>
          <Button
            component={Link}
            to={backTo}
            size="small"
            startIcon={
              // Icons are not mirrored automatically, so flip the arrow for RTL.
              <ArrowBackIcon
                sx={(theme) => ({
                  transform: theme.direction === 'rtl' ? 'scaleX(-1)' : undefined,
                })}
              />
            }
          >
            {t('common.back')}
          </Button>
        </div>
      )}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <div>
          <Typography variant="h5" component="h1">
            {title}
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </div>
        {actions}
      </Stack>
    </Stack>
  );
}
