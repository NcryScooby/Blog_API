export interface QueryOptions {
  limit: number;
  page: number;
  orderBy: 'asc' | 'desc' | 'popularity' | 'views';
}
