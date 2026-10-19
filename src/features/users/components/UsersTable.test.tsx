import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { users } from '@/test/msw/fixtures';
import { renderWithProviders } from '@/test/renderWithProviders';
import { UsersTable } from './UsersTable';

describe('UsersTable', () => {
  it('renders one row per user with a link to the details page', () => {
    renderWithProviders(<UsersTable users={users.slice(0, 2)} from="/users?q=e" />);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(3); // header + 2 users

    const firstRow = rows[1]!;
    expect(within(firstRow).getByRole('link', { name: 'Emily Johnson' })).toHaveAttribute(
      'href',
      '/users/1',
    );
    expect(within(firstRow).getByText('Admin')).toBeInTheDocument();
    expect(within(rows[2]!).getByText('Moderator')).toBeInTheDocument();
  });
});
