import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadSession } from './authStorage';
import type { AuthTokens, AuthUser, Session } from './types';

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
}

const signedOutState: AuthState = { user: null, accessToken: null, refreshToken: null };

export const authSlice = createSlice({
  name: 'auth',
  // Lazy initializer: restores a persisted session when the store is created.
  initialState: (): AuthState => loadSession() ?? signedOutState,
  reducers: {
    credentialsReceived: (_state, action: PayloadAction<Session>) => action.payload,
    tokensRefreshed: (state, action: PayloadAction<AuthTokens>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    loggedOut: () => signedOutState,
  },
  selectors: {
    selectCurrentUser: (state) => state.user,
    selectAccessToken: (state) => state.accessToken,
    selectRefreshToken: (state) => state.refreshToken,
    selectIsAuthenticated: (state) => state.user !== null && state.accessToken !== null,
  },
});

export const { credentialsReceived, tokensRefreshed, loggedOut } = authSlice.actions;
export const { selectCurrentUser, selectAccessToken, selectRefreshToken, selectIsAuthenticated } =
  authSlice.selectors;
