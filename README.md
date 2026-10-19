# Titan Store Dashboard

An e-commerce admin dashboard built on the [DummyJSON](https://dummyjson.com) API, for the
React Frontend Assessment. You can sign in, browse and filter the product catalogue, view the
signed-in user's cart, and look up users. The app ships in English and Arabic, with full RTL
support.

**Demo account:** `emilys` / `emilyspass`. The login page has a "Use demo account" button
that fills these in.

## Tech stack

| Concern          | Choice                                                                |
| ---------------- | --------------------------------------------------------------------- |
| Build / language | Vite 8, React 19, TypeScript (strict, `noUncheckedIndexedAccess`)     |
| UI               | MUI 9 (Emotion), with `stylis-plugin-rtl` for right-to-left styles    |
| State            | Redux Toolkit: RTK Query for server data, a slice for auth            |
| Routing          | React Router 8 (data router, lazy-loaded routes)                      |
| Forms            | react-hook-form + yup (`@hookform/resolvers`)                         |
| i18n             | i18next + react-i18next + browser language detector, typed keys       |
| Tests            | Vitest, Testing Library, MSW                                          |
| Quality          | oxlint (React, a11y, import and TypeScript rules), Prettier, `tsc -b` |

## Getting started

Requires **Node.js 22.12+** (developed on Node 24).

```bash
npm install
cp .env.example .env    # optional: the API URL defaults to https://dummyjson.com
npm run dev             # http://localhost:5173
```

| Script              | What it does                                              |
| ------------------- | --------------------------------------------------------- |
| `npm run dev`       | Starts the dev server                                     |
| `npm run build`     | Type-checks, then creates a production build in `dist/`   |
| `npm run preview`   | Serves the production build locally                       |
| `npm test`          | Runs the test suite once (`test:watch` keeps it watching) |
| `npm run lint`      | Runs oxlint                                               |
| `npm run typecheck` | Runs the TypeScript project build (no emit)               |
| `npm run format`    | Formats the code with Prettier                            |

## Features

- **Authentication.** Login form with validation. The session survives reloads. Private routes
  are protected and send guests to the login page, returning them to the page they asked for
  after they sign in. Expired access tokens are refreshed automatically. Logout clears the
  session.
- **Products.** Debounced search, category filter, sorting by price, rating or name, and
  pagination, all kept in the URL. A details page shows a gallery, pricing with discount,
  stock, specifications and reviews.
- **Cart.** The signed-in user's cart, with line items linking to their products, savings per
  item, and an order summary (products, quantity, subtotal, discount, total).
- **Users.** A paginated list with debounced search, shown as a table on large screens and as
  cards on smaller ones. A details page shows profile, personal, address, education and company
  information.
- **Every data view handles every state:** skeletons while loading, an error message with a
  retry button, an empty state (with a "clear filters" or "clear search" action), a page-out-of-
  range state, and a not-found state for unknown ids such as `/products/999` or `/users/abc`.
- **English and Arabic.** The layout fully mirrors in RTL. The language is detected from the
  browser and remembered. Prices, numbers and dates are formatted for the active locale, and
  Arabic plural forms are used.
- **Responsive.** The navigation drawer is permanent on desktop and slides in on mobile, and
  grids and lists adapt to the screen width.

## Project structure

The code is organised by feature: each feature owns its API endpoints, types, pages and
components.

```
src/
  app/          store factory, typed hooks, routes, lazy page registry, providers
  api/          RTK Query base API (auth headers, token refresh) and shared API types
  features/
    auth/       slice, storage, listener middleware, login page, route guards, user menu
    products/   API, request builder, URL filters hook, list and details pages, components
    cart/       API, cart page, item row, order summary
    users/      API, filters hook, list and details pages, table and card components
  components/   shared UI: loading/error/empty states, search field, pagination, page header…
  layouts/      app shell (app bar + drawer) and the auth layout
  hooks/        useDebouncedCallback, usePaginationParams, useBackLink
  i18n/         i18next setup, en/ar resources, typed translation keys
  theme/        MUI theme factory and the direction-aware Emotion cache provider
  utils/        Intl formatters, error messages, URL param helpers, id parsing
  test/         test setup, render helpers, MSW server, handlers and fixtures
```

## Key decisions

### State management

- **Server state lives in RTK Query, not hand-written slices.** One `baseApi` is created, and
  each feature adds its endpoints with `injectEndpoints`. That gives caching, request
  de-duplication, cache tags and loading/error flags without boilerplate.
- **Client state is the auth slice only.** Filters, search and pagination are URL state, not
  Redux state (see below).
- **Side effects stay out of reducers.** A listener middleware writes the session to
  `localStorage` on login and token refresh. On logout it clears storage and calls
  `resetApiState()`, so the next user never sees the previous user's cached data.
- **The store is a factory (`setupStore`),** so every test gets an isolated store with
  preloaded state.

### Authentication

- DummyJSON serves token-protected copies of every resource under `/auth/*`, for example
  `/auth/products`. These reject requests that lack a valid Bearer token, so **all requests go
  through `/auth`** and the token handling is real, not decorative.
- `baseQueryWithReauth` attaches the access token. On a `401` it calls `/auth/refresh` once and
  retries the request. Parallel requests that fail together **share one in-flight refresh**,
  and a request that raced with a refresh simply retries with the new token. If the refresh
  fails, the user is logged out.
- The `?redirect=` parameter only accepts same-origin paths, which prevents open redirects such
  as `//evil.com`.
- **Trade-off:** tokens are kept in `localStorage`, so the session survives a reload. In
  production I would prefer httpOnly, `SameSite` cookies set by the backend, because they are
  out of reach of XSS. DummyJSON is a public mock, so `localStorage` is a pragmatic choice here.
  Stored data is validated on load, and every storage call is guarded, since storage can be
  unavailable or full.

### URL as the source of truth for lists

Search, category, sort and page live in the query string (`?q=&category=&sort=&page=`).
Any view can be shared or bookmarked, and the back and forward buttons work. Changing a filter
resets the page. Detail links carry the list URL in router state, so "Back" returns to the same
filtered page; a details page opened directly falls back to the plain list.

### Products endpoint selection (DummyJSON limitation)

DummyJSON cannot combine a search term with a category, so the endpoint depends on the active
filters (`productsRequest.ts`):

| Filters           | Request                                                                            |
| ----------------- | ---------------------------------------------------------------------------------- |
| none              | `/products?limit&skip&sortBy&order`                                                |
| search only       | `/products/search?q=…`                                                             |
| category only     | `/products/category/:slug`                                                         |
| search + category | the whole category (`limit=0`), then searched and paginated in `transformResponse` |

Sorting stays server-side in every case, and list requests use `select` to download only the
fields the cards display. The client-side fallback is cheap because DummyJSON categories hold
only a few dozen products.

### Debounced search

`SearchField` keeps the typed text locally and commits it to the URL 400 ms after the user
stops typing, or straight away on Enter or clear. It debounces the callback rather than the
value (`useDebouncedCallback`). This makes it easy to keep the input in sync when the URL
changes from outside (back button) without a stale debounced value overwriting it.

### UX and performance

- **Code splitting:** every page is a `React.lazy` chunk loaded on first visit, while the app
  shell stays mounted.
- **No flicker on page change:** RTK Query keeps the previous page's data while the next one
  loads, so the grid stays visible (dimmed, with a progress bar) instead of flashing a skeleton.
- **Less re-rendering:** list items (product cards, user cards and rows, cart rows) are
  memoised, so a loading-state change in the page doesn't re-render every item.
- **Images:** list and gallery images use `loading="lazy"`, and image boxes have a fixed aspect
  ratio to avoid layout shift.
- **Error boundaries:** the page boundary is keyed by path, so navigating away from a crashed
  page recovers it. The router also has its own error element.
- **Accessibility:** the app uses semantic landmarks, headings and `dl` lists. Loading and
  error regions are labelled, and the toggles, menus and pagination are keyboard accessible.

### RTL and i18n

- The direction comes from `i18n.dir()`. The provider swaps the MUI theme direction and uses an
  Emotion cache with `stylis-plugin-rtl`, so physical CSS properties are mirrored. It also
  updates `<html dir lang>`.
- Translation keys are type-checked against `en.json` through i18next's `CustomTypeOptions`.
- Arabic uses Latin digits (`ar-u-nu-latn`). This keeps numbers consistent with MUI components,
  such as pagination, that always render Latin digits.
- Yup validation messages are translation keys that are translated at render time, so they
  follow a language switch immediately.

### Data privacy

DummyJSON user records include passwords, SSNs, bank cards, IPs and crypto wallets. The `User`
type models only the fields the dashboard needs, and none of the sensitive ones are displayed.

## Testing

`npm test` runs **78 tests**. MSW mocks the `/auth` API at the network level, so the real
store, base query, router and components are exercised.

- **Unit tests:** URL/format/error utilities, the product request builder and client-side
  search, pricing, the auth slice and session persistence, the login schema, safe redirects,
  and `useDebouncedCallback` (with fake timers).
- **API layer:** the Bearer header, a single shared refresh on parallel `401`s, and logout
  when refresh fails.
- **Components:** search field debouncing, error state with retry, pagination, switching to
  Arabic (checks that `dir="rtl"` is set), error boundary, and the users table.
- **Integration (full app routes):** the auth flow (redirects, validation, wrong password,
  login, logout); products (pagination, URL state, debounced search, combined filters, sorting,
  empty and error states, details, back navigation); cart (totals, empty, network error); users
  (search, details, not found).

## Extra features beyond the brief

- Real token-protected requests with automatic, de-duplicated token refresh
- Shareable URL state for every list, with back links that keep filters
- Client-side search inside a category, filling a gap in the API
- Users table and card layouts
- Discount and stock indicators, product image gallery and customer reviews
- Arabic plural rules, locale-aware currency, number and date formatting
- Type-safe translation keys
- Demo-account autofill on the login page

## Known limitations

- DummyJSON is read-only, and every user in the dataset has exactly one cart. The empty-cart
  and multiple-cart states exist and are tested with mocked responses, but you can't reach them
  with the real API.
- Category names come from the API in English only and are not translated.
- Product weights and dimensions have no units in the API, so they are shown as plain numbers.
