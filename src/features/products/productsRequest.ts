import type { FetchArgs } from '@reduxjs/toolkit/query';
import { PRODUCT_SUMMARY_FIELDS, type ProductListArgs, type ProductsResponse } from './types';

/**
 * DummyJSON cannot combine search and category in one request, so the endpoint is chosen from the
 * active filters. With both, the whole category is fetched (`limit=0`) and searched client-side.
 */
export function buildProductsRequest({
  q,
  category,
  sortBy,
  order,
  limit,
  skip,
}: ProductListArgs): FetchArgs {
  const params = {
    sortBy,
    order: sortBy ? order : undefined,
    select: PRODUCT_SUMMARY_FIELDS.join(','),
  };
  const term = q.trim();

  if (category && term) {
    return {
      url: `products/category/${encodeURIComponent(category)}`,
      params: { ...params, limit: 0 },
    };
  }
  if (category) {
    return {
      url: `products/category/${encodeURIComponent(category)}`,
      params: { ...params, limit, skip },
    };
  }
  if (term) {
    return { url: 'products/search', params: { ...params, q: term, limit, skip } };
  }
  return { url: 'products', params: { ...params, limit, skip } };
}

/** Applies the client-side search + pagination for the "category and search" combination. */
export function transformProductsResponse(
  response: ProductsResponse,
  { q, category, limit, skip }: ProductListArgs,
): ProductsResponse {
  const term = q.trim().toLowerCase();
  if (!category || !term) return response;

  const matches = response.products.filter(
    (product) =>
      product.title.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term) ||
      product.brand?.toLowerCase().includes(term),
  );

  return { products: matches.slice(skip, skip + limit), total: matches.length, skip, limit };
}
