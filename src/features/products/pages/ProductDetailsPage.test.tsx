import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/renderWithProviders';

describe('ProductDetailsPage', () => {
  it('renders the product details', async () => {
    renderApp('/products/2', { authenticated: true });

    expect(
      await screen.findByRole('heading', { level: 1, name: 'iPhone 13 Pro' }),
    ).toBeInTheDocument();
    // 10% off 1099.99
    expect(screen.getByText('$989.99')).toBeInTheDocument();
    expect(screen.getByText('SKU-2')).toBeInTheDocument();
    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();
  });

  it('shows a not-found state for unknown products', async () => {
    renderApp('/products/999', { authenticated: true });

    expect(await screen.findAllByText('Product not found')).not.toHaveLength(0);
    expect(screen.getByRole('link', { name: 'Back to products' })).toHaveAttribute(
      'href',
      '/products',
    );
  });

  it('treats non-numeric ids as not found without calling the API', async () => {
    renderApp('/products/abc', { authenticated: true });

    expect(await screen.findAllByText('Product not found')).not.toHaveLength(0);
  });

  it('goes back to the filtered list it came from', async () => {
    const { user, router } = renderApp('/products?q=iphone', { authenticated: true });

    await user.click(await screen.findByRole('link', { name: /iPhone 13 Pro/ }));
    await screen.findByRole('heading', { level: 1, name: 'iPhone 13 Pro' });
    await user.click(screen.getByRole('link', { name: 'Back' }));

    await waitFor(() => expect(router.state.location.search).toBe('?q=iphone'));
  });
});
