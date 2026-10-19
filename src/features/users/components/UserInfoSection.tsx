import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { InfoList, type InfoItem } from '@/components/InfoList';

interface UserInfoSectionProps {
  title: string;
  icon: ReactNode;
  items: InfoItem[];
}

export function UserInfoSection({ title, icon, items }: UserInfoSectionProps) {
  return (
    <Card component="section" sx={{ height: '100%' }}>
      <CardContent>
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', mb: 2, color: 'primary.main' }}
        >
          {icon}
          <Typography variant="h6" component="h2" color="text.primary">
            {title}
          </Typography>
        </Stack>
        <InfoList items={items} />
      </CardContent>
    </Card>
  );
}
