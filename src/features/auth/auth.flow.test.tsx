import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/renderWithProviders';
import { loadSession } from './authStorage';

describe('authentication flow', () => {
  it('redirects guests to the login page and remembers where they were going', async () => {
    const { router } = renderApp('/users?q=emily');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
    expect(router.state.location.search).toBe(`?redirect=${encodeURIComponent('/users?q=emily')}`);
  });

  it('validates the form before calling the API', async () => {
    const { user } = renderApp('/login');

    await user.click(await screen.findByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Username is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('shows an error for invalid credentials', async () => {
    const { user } = renderApp('/login');

    await user.type(await screen.findByLabelText(/username/i), 'emilys');
    await user.type(screen.getByLabelText(/^password/i), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid username or password.');
    expect(loadSession()).toBeNull();
  });

  it('signs in, persists the session and returns to the requested page', async () => {
    const { user, router, store } = renderApp('/login?redirect=%2Fsome-page');

    await user.click(await screen.findByRole('button', { name: 'Use demo account' }));
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/some-page'));
    expect(store.getState().auth.user?.username).toBe('emilys');
    expect(loadSession()?.accessToken).toBe('access-token');
  });

  it('logs out, clears the session and returns to login', async () => {
    const { user, router, store } = renderApp('/unknown', { authenticated: true });

    await user.click(await screen.findByRole('button', { name: 'Account menu' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Log out' }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
    expect(store.getState().auth.accessToken).toBeNull();
    expect(loadSession()).toBeNull();
  });
});
