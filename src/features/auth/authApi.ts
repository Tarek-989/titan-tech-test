import { ACCESS_TOKEN_TTL_MINUTES, baseApi } from '@/api/baseApi';
import { credentialsReceived } from './authSlice';
import type { LoginRequest, LoginResponse } from './types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: { ...credentials, expiresInMins: ACCESS_TOKEN_TTL_MINUTES },
      }),
      async onQueryStarted(_credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { accessToken, refreshToken, ...user } = data;
          dispatch(credentialsReceived({ user, accessToken, refreshToken }));
        } catch {
          // Login errors are rendered by the form from the mutation result.
        }
      },
    }),
  }),
});

export const { useLoginMutation } = authApi;
