import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loggedOut, selectCurrentUser } from '../authSlice';

export function UserMenu() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const user = useAppSelector(selectCurrentUser);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;
  // Popover origins are physical, so align the menu to the avatar's outer edge in both directions.
  const edge = theme.direction === 'rtl' ? 'left' : 'right';

  return (
    <>
      <Tooltip title={t('auth.accountMenu')}>
        <IconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          aria-label={t('auth.accountMenu')}
          aria-haspopup="menu"
          aria-controls={anchorEl ? 'user-menu' : undefined}
        >
          <Avatar src={user.image} alt={fullName} sx={{ width: 34, height: 34 }} />
        </IconButton>
      </Tooltip>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: edge }}
        transformOrigin={{ vertical: 'top', horizontal: edge }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2">{fullName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => dispatch(loggedOut())}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          {t('auth.logout')}
        </MenuItem>
      </Menu>
    </>
  );
}
