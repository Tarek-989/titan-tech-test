import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';
import { RouteErrorFallback } from '@/components/RouteErrorFallback';
import { GuestRoute } from '@/features/auth/GuestRoute';
import { ProtectedRoute } from '@/features/auth/ProtectedRoute';
import { AppLayout } from '@/layouts/AppLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import NotFoundPage from '@/pages/NotFoundPage';
import {
  CartPage,
  LoginPage,
  ProductDetailsPage,
  ProductsPage,
  UserDetailsPage,
  UsersPage,
} from './lazyPages';

export const routes: RouteObject[] = [
  {
    errorElement: <RouteErrorFallback />,
    children: [
      {
        element: <GuestRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [{ path: '/login', element: <LoginPage /> }],
          },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <AppLayout />,
            children: [
              { index: true, element: <Navigate to="/products" replace /> },
              { path: 'products', element: <ProductsPage /> },
              { path: 'products/:productId', element: <ProductDetailsPage /> },
              { path: 'cart', element: <CartPage /> },
              { path: 'users', element: <UsersPage /> },
              { path: 'users/:userId', element: <UserDetailsPage /> },
              { path: '*', element: <NotFoundPage /> },
            ],
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
