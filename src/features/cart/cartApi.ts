import { baseApi } from '@/api/baseApi';
import type { UserCartsResponse } from './types';

export const cartApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserCarts: build.query<UserCartsResponse, number>({
      query: (userId) => `carts/user/${userId}`,
      providesTags: (_result, _error, userId) => [{ type: 'Cart', id: `user-${userId}` }],
    }),
  }),
});

export const { useGetUserCartsQuery } = cartApi;
