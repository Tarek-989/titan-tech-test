import type { PageArgs, Paginated } from '@/api/types';

export type UserRole = 'admin' | 'moderator' | 'user';

export interface Address {
  address: string;
  city: string;
  state: string;
  stateCode: string;
  postalCode: string;
  country: string;
}

export interface Company {
  name: string;
  title: string;
  department: string;
  address: Address;
}

/**
 * The fields of a DummyJSON user that the dashboard displays. Sensitive fields the API
 * also returns (password, SSN, bank card, IP, crypto wallet…) are intentionally omitted.
 */
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  username: string;
  birthDate: string;
  image: string;
  bloodGroup: string;
  height: number;
  weight: number;
  eyeColor: string;
  hair: { color: string; type: string };
  address: Address;
  university: string;
  company: Company;
  role: UserRole;
}

/** Fields requested for list views (via DummyJSON's `select`). */
export const USER_SUMMARY_FIELDS = [
  'firstName',
  'lastName',
  'username',
  'email',
  'phone',
  'image',
  'role',
  'company',
  'address',
] as const;

export type UserSummary = Pick<User, 'id' | (typeof USER_SUMMARY_FIELDS)[number]>;

export type UsersResponse = Paginated<'users', UserSummary>;

export interface UserListArgs extends PageArgs {
  q: string;
}
