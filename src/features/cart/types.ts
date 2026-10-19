import type { Paginated } from '@/api/types';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  userId: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

export type UserCartsResponse = Paginated<'carts', Cart>;
