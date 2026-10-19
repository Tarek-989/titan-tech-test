import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '@/app/hooks';
import { selectIsAuthenticated } from './authSlice';

/** Renders child routes only for signed-in users; otherwise sends them to login and back. */
export function ProtectedRoute() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}
