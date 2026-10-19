import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { PageHeader } from '@/components/PageHeader';
import { PaginationBar } from '@/components/PaginationBar';
import { SearchField } from '@/components/SearchField';
import { UserCard } from '../components/UserCard';
import { UsersTable } from '../components/UsersTable';
import { USERS_PAGE_SIZE, useUserFilters } from '../hooks/useUserFilters';
import { useGetUsersQuery } from '../usersApi';
import type { UserSummary } from '../types';

const CARD_SIZE = { xs: 12, sm: 6 };

function UsersList({ users }: { users: UserSummary[] }) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const { pathname, search } = useLocation();
  const from = `${pathname}${search}`;

  if (isDesktop) return <UsersTable users={users} from={from} />;

  return (
    <Grid container spacing={2}>
      {users.map((user) => (
        <Grid key={user.id} size={CARD_SIZE}>
          <UserCard user={user} from={from} />
        </Grid>
      ))}
    </Grid>
  );
}

function UsersListSkeleton() {
  return (
    <Grid container spacing={2} aria-hidden>
      {Array.from({ length: 6 }, (_, index) => (
        <Grid key={index} size={CARD_SIZE}>
          <Card>
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
                <Skeleton variant="circular" width={56} height={56} />
                <Stack sx={{ flexGrow: 1 }}>
                  <Skeleton width="60%" height={28} />
                  <Skeleton width="40%" />
                </Stack>
              </Stack>
              <Skeleton />
              <Skeleton />
              <Skeleton width="70%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default function UsersPage() {
  const { t } = useTranslation();
  const filters = useUserFilters();
  const { data, error, isLoading, isFetching, isError, refetch } = useGetUsersQuery(
    filters.queryArgs,
  );

  let content: ReactNode;
  if (isLoading) {
    content = <UsersListSkeleton />;
  } else if (isError) {
    content = <ErrorState error={error} onRetry={refetch} retrying={isFetching} />;
  } else if (!data || data.total === 0) {
    content = (
      <EmptyState
        icon={<PersonSearchOutlinedIcon color="disabled" sx={{ fontSize: 56 }} />}
        title={t('users.emptyTitle')}
        description={t('users.emptyDescription', { query: filters.q })}
        action={
          filters.q && (
            <Button variant="contained" onClick={() => filters.setSearch('')}>
              {t('common.clearSearch')}
            </Button>
          )
        }
      />
    );
  } else if (data.users.length === 0) {
    content = (
      <EmptyState
        title={t('common.pageOutOfRangeTitle')}
        description={t('common.pageOutOfRangeDescription')}
        action={
          <Button variant="contained" onClick={() => filters.setPage(1)}>
            {t('common.goToFirstPage')}
          </Button>
        }
      />
    );
  } else {
    content = (
      <>
        <Box
          aria-busy={isFetching}
          sx={{ opacity: isFetching ? 0.55 : 1, transition: 'opacity 150ms ease' }}
        >
          <UsersList users={data.users} />
        </Box>
        <PaginationBar
          page={filters.page}
          pageSize={USERS_PAGE_SIZE}
          total={data.total}
          onPageChange={filters.setPage}
          disabled={isFetching}
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={t('users.title')}
        subtitle={data ? t('users.count', { count: data.total }) : t('users.subtitle')}
      />
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <SearchField
          value={filters.q}
          onSearch={filters.setSearch}
          placeholder={t('users.searchPlaceholder')}
        />
      </Paper>
      <Box sx={{ height: 4, mb: 2 }}>
        {isFetching && !isLoading && <LinearProgress aria-label={t('common.loading')} />}
      </Box>
      {content}
    </>
  );
}
