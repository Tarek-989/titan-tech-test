import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderApp } from '@/test/renderWithProviders';

const userNames = () =>
  screen.getAllByRole('article').map((card) => within(card).getByRole('heading').textContent);

describe('UsersPage', () => {
  it('lists users with pagination', async () => {
    renderApp('/users', { authenticated: true });

    expect(await screen.findByText('Emily Johnson')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(12);
    expect(screen.getByText('Showing 1–12 of 15')).toBeInTheDocument();
  });

  it('searches users with a debounced query stored in the URL', async () => {
    const { user, router } = renderApp('/users', { authenticated: true });

    await user.type(await screen.findByRole('searchbox'), 'michael');

    await waitFor(() => expect(router.state.location.search).toBe('?q=michael'));
    await waitFor(() => expect(userNames()).toEqual(['Michael Williams']));
  });

  it('shows an empty state when nothing matches', async () => {
    const { user } = renderApp('/users?q=zzz', { authenticated: true });

    expect(await screen.findByText('No users found')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { name: 'Clear search' }).at(-1)!);

    expect(await screen.findByText('Emily Johnson')).toBeInTheDocument();
  });

  it('opens the user details page', async () => {
    const { user } = renderApp('/users', { authenticated: true });

    await user.click(await screen.findByRole('link', { name: /Michael Williams/ }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Michael Williams' }),
    ).toBeInTheDocument();
    expect(screen.getByText('@michaelw')).toBeInTheDocument();
    expect(screen.getByText('Moderator')).toBeInTheDocument();
    expect(screen.getAllByText('626 Main Street')).not.toHaveLength(0);
    expect(screen.getAllByText('Phoenix')).not.toHaveLength(0);
    expect(screen.getAllByText('Mississippi')).not.toHaveLength(0);
    expect(screen.getByText('29112')).toBeInTheDocument();
    expect(screen.getAllByText('United States')).not.toHaveLength(0);
    expect(screen.getByText('University of Wisconsin--Madison')).toBeInTheDocument();
  });

  it('shows a not-found state for unknown users', async () => {
    renderApp('/users/9999', { authenticated: true });

    expect(await screen.findAllByText('User not found')).not.toHaveLength(0);
  });
});
