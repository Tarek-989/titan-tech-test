import Chip from '@mui/material/Chip';
import { useTranslation } from 'react-i18next';
import type { UserRole } from '../types';

const COLORS = { admin: 'primary', moderator: 'success', user: 'info' } as const;

export function RoleChip({ role }: { role: UserRole }) {
  const { t } = useTranslation();
  return <Chip size="small" color={COLORS[role] ?? 'default'} label={t(`users.roles.${role}`)} />;
}
