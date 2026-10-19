import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import type { ReactNode } from 'react';

export interface NavItem {
  to: string;
  labelKey: 'nav.products' | 'nav.cart' | 'nav.users';
  icon: ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/products', labelKey: 'nav.products', icon: <Inventory2OutlinedIcon /> },
  { to: '/cart', labelKey: 'nav.cart', icon: <ShoppingCartOutlinedIcon /> },
  { to: '/users', labelKey: 'nav.users', icon: <PeopleOutlinedIcon /> },
];
