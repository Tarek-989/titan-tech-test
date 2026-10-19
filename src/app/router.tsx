import { createBrowserRouter, Navigate } from 'react-router';
import { RouteErrorFallback } from '@/components/RouteErrorFallback';
import { AppLayout } from '@/layouts/AppLayout';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: <Navigate to="/products" replace /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
