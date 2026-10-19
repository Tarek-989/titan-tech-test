import Box from '@mui/material/Box';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import NotFoundPage from '@/pages/NotFoundPage';
import { ErrorFallback } from './ErrorFallback';

/** Router-level `errorElement`: catches errors thrown outside the page error boundary. */
export function RouteErrorFallback() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) return <NotFoundPage />;

  console.error(error);
  return (
    <Box sx={{ p: 3 }}>
      <ErrorFallback />
    </Box>
  );
}
