import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import type { ReactNode } from 'react';
import { StateMessage } from './StateMessage';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <StateMessage
      role="status"
      icon={icon ?? <InboxOutlinedIcon color="disabled" sx={{ fontSize: 56 }} />}
      title={title}
      description={description}
      action={action}
    />
  );
}
