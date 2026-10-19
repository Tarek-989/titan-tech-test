import { screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderApp } from '@/test/renderWithProviders';

describe('CartPage', () => {
  it("shows the signed-in user's cart items and totals", async () => {
    renderApp('/cart', { authenticated: true });

    expect(await screen.findByRole('link', { name: 'iPhone 13 Pro' })).toHaveAttribute(
      'href',
      '/products/2',
    );
    expect(screen.getByText('Shopping cart of Emily Johnson')).toBeInTheDocument();

    const summary = screen.getByRole('heading', { name: 'Order summary' }).closest('div')!;
    expect(within(summary).getByText('$2,030.00')).toBeInTheDocument();
    expect(within(summary).getByText('-$200.00')).toBeInTheDocument();
    expect(within(summary).getByText('$1,830.00')).toBeInTheDocument();
    expect(within(summary).getByText('5')).toBeInTheDocument();
  });

  it('shows an empty state when the user has no cart', async () => {
    server.use(
      http.get(`${API}/carts/user/:userId`, () =>
        HttpResponse.json({ carts: [], total: 0, skip: 0, limit: 0 }),
      ),
    );
    renderApp('/cart', { authenticated: true });

    expect(await screen.findByText('Your cart is empty')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse products' })).toHaveAttribute(
      'href',
      '/products',
    );
  });

  it('shows a network error with retry', async () => {
    server.use(http.get(`${API}/carts/user/:userId`, () => HttpResponse.error()));
    renderApp('/cart', { authenticated: true });

    expect(
      await screen.findByText('Network error. Check your connection and try again.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument();
  });
});
