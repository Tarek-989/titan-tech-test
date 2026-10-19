import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

export interface InfoItem {
  label: string;
  value: ReactNode;
}

interface InfoListProps {
  items: InfoItem[];
  /** Number of label/value columns from the `sm` breakpoint up. */
  columns?: 1 | 2;
}

/** Semantic description list (`<dl>`) for read-only label/value pairs. */
export function InfoList({ items, columns = 2 }: InfoListProps) {
  return (
    <Box
      component="dl"
      sx={{
        m: 0,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: `repeat(${columns}, minmax(0, 1fr))` },
        columnGap: 3,
        rowGap: 2,
      }}
    >
      {items.map((item) => (
        <div key={item.label}>
          <Typography component="dt" variant="caption" color="text.secondary">
            {item.label}
          </Typography>
          <Typography component="dd" variant="body2" sx={{ m: 0, overflowWrap: 'anywhere' }}>
            {item.value || '—'}
          </Typography>
        </div>
      ))}
    </Box>
  );
}
