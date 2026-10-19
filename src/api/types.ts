/** Envelope DummyJSON uses for every paginated list. `K` is the key holding the items. */
export type Paginated<K extends string, T> = {
  [P in K]: T[];
} & {
  total: number;
  skip: number;
  limit: number;
};

export interface PageArgs {
  limit: number;
  skip: number;
}

export type SortOrder = 'asc' | 'desc';
