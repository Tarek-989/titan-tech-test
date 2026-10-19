import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useParams } from 'react-router';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { PageHeader } from '@/components/PageHeader';
import { useBackLink } from '@/hooks/useBackLink';
import { useFormatters } from '@/utils/formatters';
import { isNotFoundError } from '@/utils/getErrorMessage';
import { parseId } from '@/utils/parseId';
import { RoleChip } from '../components/RoleChip';
import { UserInfoSection } from '../components/UserInfoSection';
import type { Address, User } from '../types';
import { useGetUserQuery } from '../usersApi';

function formatAddress(address: Address): string {
  return `${address.address}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
}

export default function UserDetailsPage() {
  const { t } = useTranslation();
  const { userId } = useParams();
  const id = parseId(userId);
  const backTo = useBackLink('/users');
  const {
    data: user,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetUserQuery(id ?? 0, {
    skip: id === null,
  });

  if (id === null || isNotFoundError(error)) {
    return (
      <>
        <PageHeader title={t('userDetails.notFoundTitle')} backTo={backTo} />
        <EmptyState
          icon={<PersonSearchOutlinedIcon color="disabled" sx={{ fontSize: 56 }} />}
          title={t('userDetails.notFoundTitle')}
          description={t('userDetails.notFoundDescription')}
          action={
            <Button component={RouterLink} to="/users" variant="contained">
              {t('userDetails.backToUsers')}
            </Button>
          }
        />
      </>
    );
  }

  if (isLoading) return <UserDetailsSkeleton />;

  if (error || !user) {
    return (
      <>
        <PageHeader title={t('users.title')} backTo={backTo} />
        <ErrorState error={error} onRetry={refetch} retrying={isFetching} />
      </>
    );
  }

  return (
    <>
      <PageHeader title={`${user.firstName} ${user.lastName}`} backTo={backTo} />
      <Grid container spacing={3}>
        <Grid size={12}>
          <UserProfileCard user={user} />
        </Grid>
        <UserSections user={user} />
      </Grid>
    </>
  );
}

function UserProfileCard({ user }: { user: User }) {
  return (
    <Card>
      <CardContent>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          sx={{ alignItems: { xs: 'flex-start', sm: 'center' } }}
        >
          <Avatar src={user.image} alt="" sx={{ width: 96, height: 96, bgcolor: 'grey.100' }} />
          <Stack spacing={1} sx={{ minWidth: 0 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
              <Typography variant="h6" component="p">
                @{user.username}
              </Typography>
              <RoleChip role={user.role} />
            </Stack>
            <Typography color="text.secondary">
              {user.company.title} · {user.company.name}
            </Typography>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 0.5, md: 3 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <EmailOutlinedIcon fontSize="small" color="action" />
                <Link
                  href={`mailto:${user.email}`}
                  underline="hover"
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {user.email}
                </Link>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <PhoneOutlinedIcon fontSize="small" color="action" />
                <Link href={`tel:${user.phone.replace(/[^\d+]/g, '')}`} underline="hover" dir="ltr">
                  {user.phone}
                </Link>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function UserSections({ user }: { user: User }) {
  const { t } = useTranslation();
  const format = useFormatters();

  return (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <UserInfoSection
          title={t('userDetails.personal')}
          icon={<PersonOutlinedIcon />}
          items={[
            { label: t('userDetails.fullName'), value: `${user.firstName} ${user.lastName}` },
            { label: t('userDetails.maidenName'), value: user.maidenName },
            { label: t('userDetails.birthDate'), value: format.date(user.birthDate) },
            { label: t('userDetails.age'), value: format.number(user.age) },
            { label: t('userDetails.gender'), value: user.gender },
            { label: t('userDetails.bloodGroup'), value: user.bloodGroup },
            { label: t('userDetails.height'), value: format.number(user.height) },
            { label: t('userDetails.weight'), value: format.number(user.weight) },
            { label: t('userDetails.eyeColor'), value: user.eyeColor },
            { label: t('userDetails.hair'), value: `${user.hair.color}, ${user.hair.type}` },
          ]}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Stack spacing={3} sx={{ height: '100%' }}>
          <UserInfoSection
            title={t('userDetails.address')}
            icon={<HomeOutlinedIcon />}
            items={[
              { label: t('userDetails.street'), value: user.address.address },
              { label: t('userDetails.city'), value: user.address.city },
              { label: t('userDetails.state'), value: user.address.state },
              { label: t('userDetails.postalCode'), value: user.address.postalCode },
              { label: t('userDetails.country'), value: user.address.country },
            ]}
          />
          <UserInfoSection
            title={t('userDetails.education')}
            icon={<SchoolOutlinedIcon />}
            items={[{ label: t('userDetails.university'), value: user.university }]}
          />
        </Stack>
      </Grid>
      <Grid size={12}>
        <UserInfoSection
          title={t('userDetails.company')}
          icon={<BusinessOutlinedIcon />}
          items={[
            { label: t('userDetails.companyName'), value: user.company.name },
            { label: t('userDetails.jobTitle'), value: user.company.title },
            { label: t('userDetails.department'), value: user.company.department },
            { label: t('userDetails.companyAddress'), value: formatAddress(user.company.address) },
          ]}
        />
      </Grid>
    </>
  );
}

function UserDetailsSkeleton() {
  return (
    <div aria-hidden>
      <Skeleton width={90} height={32} />
      <Skeleton width="40%" height={44} sx={{ mb: 3 }} />
      <Skeleton variant="rounded" height={140} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="rounded" height={320} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Skeleton variant="rounded" height={320} />
        </Grid>
      </Grid>
    </div>
  );
}
