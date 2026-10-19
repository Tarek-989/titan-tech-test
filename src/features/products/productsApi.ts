import { baseApi } from '@/api/baseApi';
import { buildProductsRequest, transformProductsResponse } from './productsRequest';
import type { Category, ProductListArgs, ProductsResponse } from './types';

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
    getCategories: build.query<Category[], void>({
      query: () => 'products/categories',
      providesTags: ['Category'],
      // Categories practically never change; keep them for the whole session.
      keepUnusedDataFor: 60 * 60,
    }),
  }),
});

export const { useGetProductsQuery, useGetCategoriesQuery } = productsApi;
