import { lazy } from 'react';

// Every page is code-split: its chunk is only downloaded on the first visit.
export const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
export const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage'));
export const ProductDetailsPage = lazy(
  () => import('@/features/products/pages/ProductDetailsPage'),
);
export const CartPage = lazy(() => import('@/features/cart/CartPage'));
export const UsersPage = lazy(() => import('@/features/users/pages/UsersPage'));
export const UserDetailsPage = lazy(() => import('@/features/users/pages/UserDetailsPage'));
