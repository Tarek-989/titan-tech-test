import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { baseApi } from '@/api/baseApi';
import type { AppDispatch, RootState } from '@/app/store';
import { credentialsReceived, loggedOut, tokensRefreshed } from './authSlice';
import { clearSession, saveSession } from './authStorage';

/** Keeps the persisted session in sync with the auth slice (side effects live here, not in reducers). */
export const authListenerMiddleware = createListenerMiddleware();

const startAppListening = authListenerMiddleware.startListening.withTypes<RootState, AppDispatch>();

startAppListening({
  matcher: isAnyOf(credentialsReceived, tokensRefreshed),
  effect: (_action, listenerApi) => {
    const { user, accessToken, refreshToken } = listenerApi.getState().auth;
    if (user && accessToken && refreshToken) saveSession({ user, accessToken, refreshToken });
  },
});

startAppListening({
  actionCreator: loggedOut,
  effect: (_action, listenerApi) => {
    clearSession();
    // Drop every cached response so the next user never sees the previous user's data.
    listenerApi.dispatch(baseApi.util.resetApiState());
  },
});
