import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://dummyjson.com';

const baseQuery = fetchBaseQuery({ baseUrl: API_BASE_URL, timeout: 15_000 });

/**
 * Single RTK Query API slice. Features add their endpoints with `injectEndpoints`
 * so each feature owns its API surface while sharing one cache and middleware.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Product', 'Category', 'Cart', 'User'],
  keepUnusedDataFor: 120,
  endpoints: () => ({}),
});
