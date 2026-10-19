import { describe, expect, it } from 'vitest';
import { makeProduct } from '@/test/msw/fixtures';
import { parseSortOption } from './hooks/useProductFilters';
import { getDiscountedPrice, getStockLevel } from './pricing';
import { buildProductsRequest, transformProductsResponse } from './productsRequest';
import type { ProductListArgs } from './types';

const baseArgs: ProductListArgs = { q: '', category: '', limit: 12, skip: 24 };

describe('buildProductsRequest', () => {
  it('lists all products by default', () => {
    expect(buildProductsRequest(baseArgs)).toMatchObject({
      url: 'products',
      params: { limit: 12, skip: 24, sortBy: undefined, order: undefined },
    });
  });

  it('uses the search endpoint for a search term', () => {
    expect(buildProductsRequest({ ...baseArgs, q: '  phone ' })).toMatchObject({
      url: 'products/search',
      params: { q: 'phone', limit: 12, skip: 24 },
    });
  });

  it('uses the category endpoint with server-side sorting', () => {
    expect(
      buildProductsRequest({
        ...baseArgs,
        category: 'home-decoration',
        sortBy: 'price',
        order: 'desc',
      }),
    ).toMatchObject({
      url: 'products/category/home-decoration',
      params: { sortBy: 'price', order: 'desc', limit: 12, skip: 24 },
    });
  });

  it('fetches the whole category when combined with a search term', () => {
    expect(
      buildProductsRequest({ ...baseArgs, q: 'phone', category: 'smartphones' }),
    ).toMatchObject({
      url: 'products/category/smartphones',
      params: { limit: 0 },
    });
  });

  it('only requests the fields the list needs', () => {
    const { params } = buildProductsRequest(baseArgs);
    expect(params?.select).toContain('thumbnail');
    expect(params?.select).not.toContain('reviews');
  });
});

describe('transformProductsResponse', () => {
  const response = {
    products: [
      makeProduct(1, { title: 'iPhone 9' }),
      makeProduct(2, { title: 'Galaxy', description: 'Not an iphone at all' }),
      makeProduct(3, { title: 'Pixel', brand: 'Google' }),
      makeProduct(4, { title: 'iPhone X' }),
    ],
    total: 4,
    skip: 0,
    limit: 0,
  };

  it('returns the response untouched unless search and category are combined', () => {
    expect(transformProductsResponse(response, { ...baseArgs, q: 'iphone' })).toBe(response);
  });

  it('filters by title, description or brand and paginates on the client', () => {
    const args = { q: 'IPHONE', category: 'smartphones', limit: 2, skip: 0 };

    const firstPage = transformProductsResponse(response, args);
    expect(firstPage.products.map((p) => p.id)).toEqual([1, 2]);
    expect(firstPage.total).toBe(3);

    const secondPage = transformProductsResponse(response, { ...args, skip: 2 });
    expect(secondPage.products.map((p) => p.id)).toEqual([4]);

    expect(transformProductsResponse(response, { ...args, q: 'google' }).total).toBe(1);
  });
});

describe('parseSortOption', () => {
  it('accepts known options only', () => {
    expect(parseSortOption('price-asc')).toBe('price-asc');
    expect(parseSortOption('price-sideways')).toBe('');
    expect(parseSortOption(null)).toBe('');
  });
});

describe('pricing', () => {
  it('applies the discount rounded to cents', () => {
    expect(getDiscountedPrice(1099.99, 10)).toBe(989.99);
    expect(getDiscountedPrice(9.99, 0)).toBe(9.99);
  });

  it('classifies stock levels', () => {
    expect(getStockLevel(0)).toBe('out');
    expect(getStockLevel(9)).toBe('low');
    expect(getStockLevel(10)).toBe('in');
  });
});
