import { http, HttpResponse } from 'msw';
import {
  categories,
  DEMO_PASSWORD,
  demoCart,
  demoLoginResponse,
  products,
  users,
} from './fixtures';

export const API = 'https://dummyjson.com/auth';

/** Mimics DummyJSON's `limit`/`skip`/`sortBy`/`order` handling for list endpoints. */
function paginate<T extends object>(key: string, items: T[], url: URL) {
  const sortBy = url.searchParams.get('sortBy') as keyof T | null;
  const order = url.searchParams.get('order') === 'desc' ? -1 : 1;
  const sorted = sortBy
    ? [...items].sort((a, b) =>
        a[sortBy] > b[sortBy] ? order : a[sortBy] < b[sortBy] ? -order : 0,
      )
    : items;

  const limitParam = Number(url.searchParams.get('limit') ?? 30);
  const skip = Number(url.searchParams.get('skip') ?? 0);
  const limit = limitParam === 0 ? sorted.length : limitParam;

  return HttpResponse.json({
    [key]: sorted.slice(skip, skip + limit),
    total: sorted.length,
    skip,
    limit,
  });
}

export const handlers = [
  http.post(`${API}/login`, async ({ request }) => {
    const body = (await request.json()) as { username?: string; password?: string };
    if (body.username === demoLoginResponse.username && body.password === DEMO_PASSWORD) {
      return HttpResponse.json(demoLoginResponse);
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 400 });
  }),

  http.get(`${API}/products`, ({ request }) =>
    paginate('products', products, new URL(request.url)),
  ),

  http.get(`${API}/products/search`, ({ request }) => {
    const url = new URL(request.url);
    const term = (url.searchParams.get('q') ?? '').toLowerCase();
    const matches = products.filter((product) => product.title.toLowerCase().includes(term));
    return paginate('products', matches, url);
  }),

  http.get(`${API}/products/categories`, () => HttpResponse.json(categories)),

  http.get(`${API}/products/category/:slug`, ({ request, params }) => {
    const matches = products.filter((product) => product.category === params.slug);
    return paginate('products', matches, new URL(request.url));
  }),

  http.get(`${API}/products/:id`, ({ params }) => {
    const product = products.find((item) => item.id === Number(params.id));
    return product
      ? HttpResponse.json(product)
      : HttpResponse.json(
          { message: `Product with id '${String(params.id)}' not found` },
          { status: 404 },
        );
  }),

  http.get(`${API}/carts/user/:userId`, ({ params }) => {
    const carts = Number(params.userId) === demoCart.userId ? [demoCart] : [];
    return HttpResponse.json({ carts, total: carts.length, skip: 0, limit: carts.length });
  }),

  http.get(`${API}/users`, ({ request }) => paginate('users', users, new URL(request.url))),

  http.get(`${API}/users/search`, ({ request }) => {
    const url = new URL(request.url);
    const term = (url.searchParams.get('q') ?? '').toLowerCase();
    const matches = users.filter((user) =>
      [user.firstName, user.lastName, user.username, user.email].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
    return paginate('users', matches, url);
  }),

  http.get(`${API}/users/:id`, ({ params }) => {
    const user = users.find((item) => item.id === Number(params.id));
    return user
      ? HttpResponse.json(user)
      : HttpResponse.json(
          { message: `User with id '${String(params.id)}' not found` },
          { status: 404 },
        );
  }),
];
