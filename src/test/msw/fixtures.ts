import type { LoginResponse, Session } from '@/features/auth/types';
import type { Cart } from '@/features/cart/types';
import type { Category, Product } from '@/features/products/types';
import type { User } from '@/features/users/types';

export const DEMO_PASSWORD = 'emilyspass';

export const demoUser = {
  id: 1,
  username: 'emilys',
  email: 'emily.johnson@x.dummyjson.com',
  firstName: 'Emily',
  lastName: 'Johnson',
  gender: 'female',
  image: 'https://dummyjson.com/icon/emilys/128',
};

export const demoLoginResponse: LoginResponse = {
  ...demoUser,
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

export const demoSession: Session = {
  user: demoUser,
  accessToken: 'access-token',
  refreshToken: 'refresh-token',
};

export function makeProduct(id: number, overrides: Partial<Product> = {}): Product {
  return {
    id,
    title: `Product ${id}`,
    description: `Description of product ${id}`,
    category: id % 2 === 0 ? 'smartphones' : 'beauty',
    price: 10 * id,
    discountPercentage: 10,
    rating: 4.2,
    stock: 50,
    tags: [],
    brand: 'Acme',
    sku: `SKU-${id}`,
    weight: 1,
    dimensions: { width: 1, height: 1, depth: 1 },
    warrantyInformation: '1 year warranty',
    shippingInformation: 'Ships in 1 week',
    availabilityStatus: 'In Stock',
    reviews: [],
    returnPolicy: '30 days return policy',
    minimumOrderQuantity: 1,
    images: [`https://cdn.example.com/${id}.webp`],
    thumbnail: `https://cdn.example.com/${id}-thumb.webp`,
    ...overrides,
  };
}

export const products: Product[] = [
  makeProduct(1, { title: 'Essence Mascara', category: 'beauty', price: 9.99 }),
  makeProduct(2, { title: 'iPhone 13 Pro', category: 'smartphones', price: 1099.99 }),
  ...Array.from({ length: 18 }, (_, index) => makeProduct(index + 3)),
];

export const categories: Category[] = [
  { slug: 'beauty', name: 'Beauty', url: 'https://dummyjson.com/products/category/beauty' },
  {
    slug: 'smartphones',
    name: 'Smartphones',
    url: 'https://dummyjson.com/products/category/smartphones',
  },
];

export const demoCart: Cart = {
  id: 1,
  userId: demoUser.id,
  products: [
    {
      id: 2,
      title: 'iPhone 13 Pro',
      price: 1000,
      quantity: 2,
      total: 2000,
      discountPercentage: 10,
      discountedTotal: 1800,
      thumbnail: 'https://cdn.example.com/2-thumb.webp',
    },
    {
      id: 1,
      title: 'Essence Mascara',
      price: 10,
      quantity: 3,
      total: 30,
      discountPercentage: 0,
      discountedTotal: 30,
      thumbnail: 'https://cdn.example.com/1-thumb.webp',
    },
  ],
  total: 2030,
  discountedTotal: 1830,
  totalProducts: 2,
  totalQuantity: 5,
};

const address = {
  address: '626 Main Street',
  city: 'Phoenix',
  state: 'Mississippi',
  stateCode: 'MS',
  postalCode: '29112',
  country: 'United States',
};

export function makeUser(id: number, overrides: Partial<User> = {}): User {
  return {
    id,
    firstName: `First${id}`,
    lastName: `Last${id}`,
    maidenName: '',
    age: 30,
    gender: 'female',
    email: `user${id}@x.dummyjson.com`,
    phone: '+1 555-0100',
    username: `user${id}`,
    birthDate: '1996-5-30',
    image: `https://dummyjson.com/icon/user${id}/128`,
    bloodGroup: 'O-',
    height: 170,
    weight: 60,
    eyeColor: 'Green',
    hair: { color: 'Brown', type: 'Curly' },
    address,
    university: 'University of Wisconsin--Madison',
    company: { name: 'Dooley Inc', title: 'Sales Manager', department: 'Engineering', address },
    role: 'user',
    ...overrides,
  };
}

export const users: User[] = [
  makeUser(1, { firstName: 'Emily', lastName: 'Johnson', username: 'emilys', role: 'admin' }),
  makeUser(2, {
    firstName: 'Michael',
    lastName: 'Williams',
    username: 'michaelw',
    role: 'moderator',
  }),
  ...Array.from({ length: 13 }, (_, index) => makeUser(index + 3)),
];
