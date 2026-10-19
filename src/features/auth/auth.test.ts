import { describe, expect, it } from 'vitest';
import { setupStore } from '@/app/store';
import { demoSession } from '@/test/msw/fixtures';
import {
  authSlice,
  credentialsReceived,
  loggedOut,
  selectCurrentUser,
  selectIsAuthenticated,
  tokensRefreshed,
} from './authSlice';
import { loadSession } from './authStorage';
import { loginSchema } from './loginSchema';
import { getSafeRedirect } from './redirect';

describe('authSlice', () => {
  const { reducer } = authSlice;
  const signedOut = { user: null, accessToken: null, refreshToken: null };

  it('stores the session on login and clears it on logout', () => {
    const signedIn = reducer(signedOut, credentialsReceived(demoSession));
    expect(signedIn).toEqual(demoSession);

    expect(reducer(signedIn, loggedOut())).toEqual(signedOut);
  });

  it('replaces only the tokens on refresh', () => {
    const state = reducer(
      demoSession,
      tokensRefreshed({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
    );
    expect(state).toEqual({
      ...demoSession,
      accessToken: 'new-access',
      refreshToken: 'new-refresh',
    });
  });

  it('exposes selectors on the root state', () => {
    const store = setupStore({ auth: demoSession });
    expect(selectIsAuthenticated(store.getState())).toBe(true);
    expect(selectCurrentUser(store.getState())?.username).toBe('emilys');
  });
});

describe('session persistence', () => {
  it('saves the session on login and removes it on logout', () => {
    const store = setupStore();

    store.dispatch(credentialsReceived(demoSession));
    expect(loadSession()).toEqual(demoSession);

    store.dispatch(tokensRefreshed({ accessToken: 'a2', refreshToken: 'r2' }));
    expect(loadSession()?.accessToken).toBe('a2');

    store.dispatch(loggedOut());
    expect(loadSession()).toBeNull();
  });

  it('restores a saved session when the store is created', () => {
    localStorage.setItem('titan.session', JSON.stringify(demoSession));
    expect(selectIsAuthenticated(setupStore().getState())).toBe(true);
  });

  it('ignores corrupted or malformed storage', () => {
    localStorage.setItem('titan.session', '{not json');
    expect(loadSession()).toBeNull();

    localStorage.setItem('titan.session', JSON.stringify({ accessToken: 1 }));
    expect(loadSession()).toBeNull();
    expect(selectIsAuthenticated(setupStore().getState())).toBe(false);
  });
});

describe('loginSchema', () => {
  /** First error per field, which is what the form displays. */
  const firstErrors = (values: { username: string; password: string }) =>
    Promise.all(
      (['username', 'password'] as const).map((field) =>
        loginSchema
          .validateAt(field, values)
          .then(() => null)
          .catch((error: { message: string }) => error.message),
      ),
    );

  it('accepts valid credentials and trims the username', async () => {
    await expect(
      loginSchema.validate({ username: ' emilys ', password: 'emilyspass' }),
    ).resolves.toEqual({
      username: 'emilys',
      password: 'emilyspass',
    });
  });

  it('reports required and min-length errors as i18n keys', async () => {
    expect(await firstErrors({ username: '  ', password: '' })).toEqual([
      'auth.validation.usernameRequired',
      'auth.validation.passwordRequired',
    ]);
    expect(await firstErrors({ username: 'ab', password: '123' })).toEqual([
      'auth.validation.usernameMin',
      'auth.validation.passwordMin',
    ]);
  });
});

describe('getSafeRedirect', () => {
  it.each([
    ['/users?q=emily', '/users?q=emily'],
    [null, '/products'],
    ['https://evil.com', '/products'],
    ['//evil.com', '/products'],
    ['/\\evil.com', '/products'],
  ])('maps %s to %s', (value, expected) => {
    expect(getSafeRedirect(value)).toBe(expected);
  });
});
