import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorState } from './ErrorState';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PaginationBar } from './PaginationBar';
import { SearchField } from './SearchField';

describe('SearchField', () => {
  it('emits the trimmed term once typing pauses, not on every keystroke', async () => {
    const onSearch = vi.fn();
    const { user } = renderWithProviders(
      <SearchField value="" onSearch={onSearch} debounceMs={300} />,
    );

    await user.type(screen.getByRole('searchbox'), '  phone ');

    await waitFor(() => expect(onSearch).toHaveBeenLastCalledWith('phone'));
    expect(onSearch).not.toHaveBeenCalledWith('');
    expect(onSearch).not.toHaveBeenCalledWith('p');
  });

  it('searches immediately on Enter and clears with the clear button', async () => {
    const onSearch = vi.fn();
    const { user } = renderWithProviders(
      <SearchField value="" onSearch={onSearch} debounceMs={10_000} />,
    );

    await user.type(screen.getByRole('searchbox'), 'laptop{Enter}');
    expect(onSearch).toHaveBeenLastCalledWith('laptop');

    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onSearch).toHaveBeenLastCalledWith('');
    expect(screen.getByRole('searchbox')).toHaveValue('');
  });
});

describe('ErrorState', () => {
  it('shows the API message and retries', async () => {
    const onRetry = vi.fn();
    const { user } = renderWithProviders(
      <ErrorState error={{ status: 500, data: { message: 'Boom' } }} onRetry={onRetry} />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Boom');
    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

describe('PaginationBar', () => {
  it('shows the visible range and changes page', async () => {
    const onPageChange = vi.fn();
    const { user } = renderWithProviders(
      <PaginationBar page={2} pageSize={10} total={25} onPageChange={onPageChange} />,
    );

    expect(screen.getByText('Showing 11–20 of 25')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('renders nothing when there are no results', () => {
    renderWithProviders(<PaginationBar page={1} pageSize={10} total={0} onPageChange={vi.fn()} />);
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
  });
});

describe('LanguageSwitcher', () => {
  it('switches to Arabic and flips the document to RTL', async () => {
    const { user } = renderWithProviders(<LanguageSwitcher />);
    expect(document.documentElement).toHaveAttribute('dir', 'ltr');

    await user.click(screen.getByRole('button', { name: 'Change language' }));
    await user.click(screen.getByRole('menuitem', { name: 'العربية' }));

    await waitFor(() => expect(document.documentElement).toHaveAttribute('dir', 'rtl'));
    expect(document.documentElement).toHaveAttribute('lang', 'ar');
    expect(screen.getByRole('button', { name: 'تغيير اللغة' })).toBeInTheDocument();
  });
});

describe('ErrorBoundary', () => {
  function Boom(): never {
    throw new Error('render failure');
  }

  it('renders a fallback instead of crashing the app', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    renderWithProviders(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument();
  });
});
