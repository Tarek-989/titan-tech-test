import Box from '@mui/material/Box';
import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { LoadingState } from '@/components/LoadingState';

export function AuthLayout() {
  return (
    <Box
      component="main"
      sx={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: (theme) =>
          `linear-gradient(135deg, ${theme.palette.primary.main}14 0%, ${theme.palette.background.default} 60%)`,
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <LanguageSwitcher />
      </Box>
      <Suspense fallback={<LoadingState />}>
        <Outlet />
      </Suspense>
    </Box>
  );
}
