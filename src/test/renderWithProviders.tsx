import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider, type RouteObject } from 'react-router';
import { routes } from '@/app/router';
import { setupStore, type RootState } from '@/app/store';
import { ThemeDirectionProvider } from '@/theme/ThemeDirectionProvider';
import { demoSession } from './msw/fixtures';

interface RenderOptions {
  /** Initial URL. */
  route?: string;
  preloadedState?: Partial<RootState>;
  /** Start with the demo user signed in. */
  authenticated?: boolean;
}

function renderRouter(routeObjects: RouteObject[], options: RenderOptions) {
  const { route = '/', authenticated = false } = options;
  const preloadedState: Partial<RootState> = {
    ...(authenticated && { auth: demoSession }),
    ...options.preloadedState,
  };
  const store = setupStore(preloadedState);
  const router = createMemoryRouter(routeObjects, { initialEntries: [route] });
  const user = userEvent.setup();

  const view = render(
    <Provider store={store}>
      <ThemeDirectionProvider>
        <RouterProvider router={router} />
      </ThemeDirectionProvider>
    </Provider>,
  );

  return { ...view, store, router, user };
}

/** Renders a single element inside the app providers, mounted at `path`. */
export function renderWithProviders(
  ui: ReactElement,
  { path = '/', ...options }: RenderOptions & { path?: string } = {},
) {
  return renderRouter([{ path, element: ui }], { route: path, ...options });
}

/** Renders the whole application (real routes, layouts and guards) at `route`. */
export function renderApp(route: string, options: Omit<RenderOptions, 'route'> = {}) {
  return renderRouter(routes, { ...options, route });
}
