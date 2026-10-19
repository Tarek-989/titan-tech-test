import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {
  loggedOut,
  selectAccessToken,
  selectRefreshToken,
  tokensRefreshed,
  type AuthState,
} from '@/features/auth/authSlice';
import type { AuthTokens } from '@/features/auth/types';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://dummyjson.com';

/** Lifetime requested for access tokens on login and refresh. */
export const ACCESS_TOKEN_TTL_MINUTES = 30;

type StateWithAuth = { auth: AuthState };

/**
 * DummyJSON serves token-protected copies of every resource under `/auth`
 * (e.g. `/auth/products`), so all requests go there and really need a valid Bearer token.
 */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${API_BASE_URL}/auth`,
  timeout: 15_000,
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState() as StateWithAuth);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

/** Endpoints whose 401/400 responses are meaningful to the caller and must not trigger a refresh. */
const SESSION_ENDPOINTS = new Set(['login']);

// Shared by every request that hits a 401 at the same time, so only one refresh call is made.
let refreshInFlight: Promise<boolean> | null = null;

async function refreshAccessToken(
  api: BaseQueryApi,
  extraOptions: Parameters<typeof rawBaseQuery>[2],
): Promise<boolean> {
  const refreshToken = selectRefreshToken(api.getState() as StateWithAuth);
  if (!refreshToken) return false;

  const result = await rawBaseQuery(
    {
      url: 'refresh',
      method: 'POST',
      body: { refreshToken, expiresInMins: ACCESS_TOKEN_TTL_MINUTES },
    },
    api,
    extraOptions,
  );
  if (!result.data) return false;

  api.dispatch(tokensRefreshed(result.data as AuthTokens));
  return true;
}

/** Attaches the access token; on a 401 refreshes it once and retries, or logs out. */
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  if (refreshInFlight) await refreshInFlight;

  const tokenUsed = selectAccessToken(api.getState() as StateWithAuth);
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status !== 401 || SESSION_ENDPOINTS.has(api.endpoint)) return result;

  // Another request may have refreshed the token while this one was in flight.
  const currentToken = selectAccessToken(api.getState() as StateWithAuth);
  if (currentToken && currentToken !== tokenUsed) return rawBaseQuery(args, api, extraOptions);

  refreshInFlight ??= refreshAccessToken(api, extraOptions).finally(() => {
    refreshInFlight = null;
  });

  if (await refreshInFlight) return rawBaseQuery(args, api, extraOptions);

  api.dispatch(loggedOut());
  return result;
};

/**
 * Single RTK Query API slice. Features add their endpoints with `injectEndpoints`
 * so each feature owns its API surface while sharing one cache and middleware.
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Product', 'Category', 'Cart', 'User'],
  keepUnusedDataFor: 120,
  endpoints: () => ({}),
});
