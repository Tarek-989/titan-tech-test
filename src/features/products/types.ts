import type { Paginated, SortOrder } from '@/api/types';

export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: { width: number; height: number; depth: number };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  images: string[];
  thumbnail: string;
}

/** Fields requested for list views (via DummyJSON's `select`) to keep payloads small. */
export const PRODUCT_SUMMARY_FIELDS = [
  'title',
  'description',
  'category',
  'price',
  'discountPercentage',
  'rating',
  'stock',
  'brand',
  'thumbnail',
] as const;

export type ProductSummary = Pick<Product, 'id' | (typeof PRODUCT_SUMMARY_FIELDS)[number]>;

export type ProductsResponse = Paginated<'products', ProductSummary>;

export interface Category {
  slug: string;
  name: string;
  url: string;
}

export type ProductSortField = 'price' | 'rating' | 'title';

export interface ProductListArgs {
  q: string;
  category: string;
  sortBy?: ProductSortField;
  order?: SortOrder;
  limit: number;
  skip: number;
}
