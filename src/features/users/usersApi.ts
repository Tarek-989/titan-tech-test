import { baseApi } from '@/api/baseApi';
import { USER_SUMMARY_FIELDS, type User, type UserListArgs, type UsersResponse } from './types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<UsersResponse, UserListArgs>({
      query: ({ q, limit, skip }) => {
        const term = q.trim();
        return {
          url: term ? 'users/search' : 'users',
          params: { q: term || undefined, limit, skip, select: USER_SUMMARY_FIELDS.join(',') },
        };
      },
      providesTags: (result) => [
        ...(result?.users.map(({ id }) => ({ type: 'User' as const, id })) ?? []),
        { type: 'User', id: 'LIST' },
      ],
    }),
    getUser: build.query<User, number>({
      query: (id) => `users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserQuery } = usersApi;
