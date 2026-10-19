import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { setupStore } from '@/app/store';
import { loadSession } from '@/features/auth/authStorage';
import { productsApi } from '@/features/products/productsApi';
import { categories, demoSession } from '@/test/msw/fixtures';
import { API } from '@/test/msw/handlers';
import { server } from '@/test/msw/server';

/** Categories endpoint that only accepts `validToken`, counting requests per token. */
function protectedCategories(validToken: string, seenTokens: string[]) {
  return http.get(`${API}/products/categories`, ({ request }) => {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '') ?? '';
    seenTokens.push(token);
    return token === validToken
      ? HttpResponse.json(categories)
      : HttpResponse.json({ message: 'Invalid/Expired Token!' }, { status: 401 });
  });
}

describe('baseQueryWithReauth', () => {
  it('sends the access token as a Bearer header', async () => {
    const seen: string[] = [];
    server.use(protectedCategories('access-token', seen));
    const store = setupStore({ auth: demoSession });

    const result = await store.dispatch(productsApi.endpoints.getCategories.initiate());

    expect(result.data).toEqual(categories);
    expect(seen).toEqual(['access-token']);
  });

  it('refreshes an expired token once and retries the request', async () => {
    const seen: string[] = [];
    let refreshCalls = 0;
    server.use(
      protectedCategories('fresh-token', seen),
      http.post(`${API}/refresh`, async ({ request }) => {
        refreshCalls += 1;
        expect(await request.json()).toMatchObject({ refreshToken: 'refresh-token' });
        return HttpResponse.json({ accessToken: 'fresh-token', refreshToken: 'fresh-refresh' });
      }),
    );
    const store = setupStore({ auth: demoSession });

    const result = await store.dispatch(productsApi.endpoints.getCategories.initiate());

    expect(result.data).toEqual(categories);
    expect(refreshCalls).toBe(1);
    expect(seen).toEqual(['access-token', 'fresh-token']);
    expect(store.getState().auth).toMatchObject({
      accessToken: 'fresh-token',
      refreshToken: 'fresh-refresh',
    });
  });

  it('shares a single refresh between parallel requests', async () => {
    let refreshCalls = 0;
    server.use(
      protectedCategories('fresh-token', []),
      http.get(`${API}/products`, ({ request }) =>
        request.headers.get('Authorization') === 'Bearer fresh-token'
          ? HttpResponse.json({ products: [], total: 0, skip: 0, limit: 12 })
          : HttpResponse.json({ message: 'Invalid/Expired Token!' }, { status: 401 }),
      ),
      http.post(`${API}/refresh`, () => {
        refreshCalls += 1;
        return HttpResponse.json({ accessToken: 'fresh-token', refreshToken: 'fresh-refresh' });
      }),
    );
    const store = setupStore({ auth: demoSession });

    const [categoriesResult, productsResult] = await Promise.all([
      store.dispatch(productsApi.endpoints.getCategories.initiate()),
      store.dispatch(
        productsApi.endpoints.getProducts.initiate({ q: '', category: '', limit: 12, skip: 0 }),
      ),
    ]);

    expect(categoriesResult.isSuccess).toBe(true);
    expect(productsResult.isSuccess).toBe(true);
    expect(refreshCalls).toBe(1);
  });

  it('logs out when the refresh token is rejected', async () => {
    server.use(
      protectedCategories('never-valid', []),
      http.post(`${API}/refresh`, () =>
        HttpResponse.json({ message: 'Invalid refresh token' }, { status: 403 }),
      ),
    );
    const store = setupStore({ auth: demoSession });

    const result = await store.dispatch(productsApi.endpoints.getCategories.initiate());

    expect(result.isSuccess).toBe(false);
    expect(store.getState().auth).toEqual({ user: null, accessToken: null, refreshToken: null });
    expect(loadSession()).toBeNull();
  });
});
