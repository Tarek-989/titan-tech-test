import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface StateMessageProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  role?: 'alert' | 'status';
}

/** Shared centered card used by the empty and error states. */
export function StateMessage({ icon, title, description, action, role }: StateMessageProps) {
  return (
    <Paper variant="outlined" role={role} sx={{ px: 3, py: 6, textAlign: 'center' }}>
      <Stack spacing={1.5} sx={{ alignItems: 'center', maxWidth: 480, mx: 'auto' }}>
        {icon}
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        {description && <Typography color="text.secondary">{description}</Typography>}
        {action && (
          <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
            {action}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
