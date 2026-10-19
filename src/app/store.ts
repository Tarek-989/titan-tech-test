import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { baseApi } from '@/api/baseApi';
import { authListenerMiddleware } from '@/features/auth/authListeners';
import { authSlice } from '@/features/auth/authSlice';

const rootReducer = combineReducers({
  [authSlice.reducerPath]: authSlice.reducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

/** Store factory, so tests can create an isolated store with preloaded state. */
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(authListenerMiddleware.middleware).concat(baseApi.middleware),
  });
}

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

export const store = setupStore();

// Enables refetchOnFocus / refetchOnReconnect behaviours.
setupListeners(store.dispatch);
