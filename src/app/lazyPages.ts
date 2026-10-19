import { lazy } from 'react';

// Every page is code-split: its chunk is only downloaded on the first visit.
export const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
