import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import type { UserSummary } from '../types';
import { RoleChip } from './RoleChip';

interface UsersTableProps {
  users: UserSummary[];
  from: string;
}

const UserRow = memo(function UserRow({ user, from }: { user: UserSummary; from: string }) {
  return (
    <TableRow hover>
      <TableCell>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar src={user.image} alt="" sx={{ width: 36, height: 36 }} />
          <div>
            <Link
              component={RouterLink}
              to={`/users/${user.id}`}
              state={{ from }}
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              {user.firstName} {user.lastName}
            </Link>
            <Typography variant="body2" color="text.secondary">
              @{user.username}
            </Typography>
          </div>
        </Stack>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell sx={{ whiteSpace: 'nowrap' }}>
        <span dir="ltr">{user.phone}</span>
      </TableCell>
      <TableCell>
        <Typography variant="body2">{user.company.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user.company.name}
        </Typography>
      </TableCell>
      <TableCell>
        <RoleChip role={user.role} />
      </TableCell>
    </TableRow>
  );
});

/** Desktop layout for the users list; small screens use cards instead. */
export function UsersTable({ users, from }: UsersTableProps) {
  const { t } = useTranslation();

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table aria-label={t('users.title')}>
        <TableHead>
          <TableRow>
            <TableCell>{t('users.columns.name')}</TableCell>
            <TableCell>{t('users.columns.email')}</TableCell>
            <TableCell>{t('users.columns.phone')}</TableCell>
            <TableCell>{t('users.columns.company')}</TableCell>
            <TableCell>{t('users.columns.role')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user) => (
            <UserRow key={user.id} user={user} from={from} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
