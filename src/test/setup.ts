import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import i18n from '@/i18n';
import { server } from './msw/server';

// Lazy-loaded route chunks are transformed on first use, which can exceed the 1s default.
configure({ asyncUtilTimeout: 10_000 });

beforeAll(() => {
  server.listen({ onUnhandledFrame: 'error' });
  // jsdom does not implement scrolling.
  window.scrollTo = () => {};
});

beforeEach(async () => {
  await i18n.changeLanguage('en');
});

afterEach(() => {
  cleanup();
  server.resetHandlers();
  localStorage.clear();
});

afterAll(() => {
  server.close();
});
