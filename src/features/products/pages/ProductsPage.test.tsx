import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { API } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';
import { renderApp } from '@/test/renderWithProviders';

const productTitles = () =>
  screen.getAllByRole('article').map((card) => within(card).getByRole('heading').textContent);

describe('ProductsPage', () => {
  it('lists the first page of products with pagination', async () => {
    renderApp('/products', { authenticated: true });

    expect(await screen.findByText('Essence Mascara')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(12);
    expect(screen.getByText('Showing 1–12 of 20')).toBeInTheDocument();
    expect(screen.getByText('20 products')).toBeInTheDocument();
  });

  it('moves to the next page and stores it in the URL', async () => {
    const { user, router } = renderApp('/products', { authenticated: true });

    await user.click(await screen.findByRole('button', { name: 'Go to page 2' }));

    expect(await screen.findByText('Showing 13–20 of 20')).toBeInTheDocument();
    expect(router.state.location.search).toBe('?page=2');
  });

  it('debounces the search and resets to the first page', async () => {
    const { user, router } = renderApp('/products?page=2', { authenticated: true });

    await user.type(await screen.findByRole('searchbox', { name: 'Search products…' }), 'iphone');

    await waitFor(() => expect(router.state.location.search).toBe('?q=iphone'));
    await waitFor(() => expect(productTitles()).toEqual(['iPhone 13 Pro']));
  });

  it('combines category and search filters from the URL', async () => {
    renderApp('/products?category=smartphones&q=product%201', { authenticated: true });

    await waitFor(() =>
      expect(productTitles()).toEqual([
        'Product 10',
        'Product 12',
        'Product 14',
        'Product 16',
        'Product 18',
      ]),
    );
    expect(screen.getByRole('combobox', { name: 'Category' })).toHaveTextContent('Smartphones');
  });

  it('sorts by price', async () => {
    renderApp('/products?sort=price-desc', { authenticated: true });

    await waitFor(() => expect(productTitles()[0]).toBe('iPhone 13 Pro'));
  });

  it('shows an empty state and lets the user clear filters', async () => {
    const { user, router } = renderApp('/products?q=nothing-matches', { authenticated: true });

    expect(await screen.findByText('No products found')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Clear filters' })[0]!);

    await waitFor(() => expect(router.state.location.search).toBe(''));
    expect(await screen.findByText('Essence Mascara')).toBeInTheDocument();
  });

  it('shows an error state and retries', async () => {
    let failed = false;
    server.use(
      http.get(`${API}/products`, () => {
        if (failed) return undefined; // fall through to the default handler
        failed = true;
        return HttpResponse.json({ message: 'Server exploded' }, { status: 500 });
      }),
    );
    const { user } = renderApp('/products', { authenticated: true });

    expect(await screen.findByText('Server exploded')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Essence Mascara')).toBeInTheDocument();
  });
});
