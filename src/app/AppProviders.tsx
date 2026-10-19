import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeDirectionProvider } from '@/theme/ThemeDirectionProvider';
import { store } from './store';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeDirectionProvider>
        <ErrorBoundary>{children}</ErrorBoundary>
      </ThemeDirectionProvider>
    </Provider>
  );
}
