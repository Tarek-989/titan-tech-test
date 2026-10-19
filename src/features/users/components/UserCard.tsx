import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import WorkOutlinedIcon from '@mui/icons-material/WorkOutlined';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { memo, type ReactNode } from 'react';
import { Link } from 'react-router';
import type { UserSummary } from '../types';
import { RoleChip } from './RoleChip';

function Detail({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: 'center', color: 'text.secondary', minWidth: 0 }}
    >
      {icon}
      <Typography variant="body2" noWrap>
        {children}
      </Typography>
    </Stack>
  );
}

interface UserCardProps {
  user: UserSummary;
  /** List URL (with filters) the details page links back to. */
  from: string;
}

function UserCardComponent({ user, from }: UserCardProps) {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Card component="article" sx={{ height: '100%' }}>
      <CardActionArea
        component={Link}
        to={`/users/${user.id}`}
        state={{ from }}
        sx={{ height: '100%', alignItems: 'stretch' }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
            <Avatar src={user.image} alt="" sx={{ width: 56, height: 56 }} />
            <Stack sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 600 }} noWrap>
                {fullName}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                @{user.username}
              </Typography>
            </Stack>
            <RoleChip role={user.role} />
          </Stack>
          <Stack spacing={1}>
            <Detail icon={<EmailOutlinedIcon fontSize="small" />}>{user.email}</Detail>
            <Detail icon={<WorkOutlinedIcon fontSize="small" />}>
              {user.company.title} · {user.company.name}
            </Detail>
            <Detail icon={<LocationOnOutlinedIcon fontSize="small" />}>
              {user.address.city}, {user.address.country}
            </Detail>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export const UserCard = memo(UserCardComponent);
