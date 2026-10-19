import { baseApi } from '@/api/baseApi';
import { buildProductsRequest, transformProductsResponse } from './productsRequest';
import type { Category, Product, ProductListArgs, ProductsResponse } from './types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<ProductsResponse, ProductListArgs>({
      query: buildProductsRequest,
      transformResponse: (response: ProductsResponse, _meta, args) =>
        transformProductsResponse(response, args),
      providesTags: (result) => [
        ...(result?.products.map(({ id }) => ({ type: 'Product' as const, id })) ?? []),
        { type: 'Product', id: 'LIST' },
      ],
    }),
    getProduct: build.query<Product, number>({
      query: (id) => `products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    getCategories: build.query<Category[], void>({
      query: () => 'products/categories',
      providesTags: ['Category'],
      // Categories practically never change; keep them for the whole session.
      keepUnusedDataFor: 60 * 60,
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useGetCategoriesQuery } = productsApi;
