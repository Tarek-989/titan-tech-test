import { Navigate, Outlet, useSearchParams } from 'react-router';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from './authSlice';
import { getSafeRedirect } from './redirect';

/** Keeps signed-in users away from guest-only pages such as the login screen. */
export function GuestRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [searchParams] = useSearchParams();

  if (isAuthenticated) {
    return <Navigate to={getSafeRedirect(searchParams.get('redirect'))} replace />;
  }

  return <Outlet />;
}
