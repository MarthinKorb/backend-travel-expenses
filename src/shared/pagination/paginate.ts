// src/common/utils/paginate-raw-query.ts

import { SelectQueryBuilder } from 'typeorm';

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
  links: {
    first: string;
    previous: string | null;
    next: string | null;
    last: string;
  };
}

export async function paginateRawQuery<T>(
  qb: SelectQueryBuilder<T>,
  alias: string,
  idField: any,
  page = 1,
  limit = 10,
): Promise<Paginated<T>> {
  const offset = (page - 1) * limit;

  const [items, countResult] = await Promise.all([
    qb.clone().skip(offset).take(limit).getRawMany(),

    qb
      .clone()
      .orderBy()
      .select(`COUNT(DISTINCT ${alias}.${idField})`, 'count')
      .getRawOne(),
  ]);

  const totalItems = parseInt(countResult.count, 10);

  const totalPages = Math.ceil(totalItems / limit);

  // Links de navegação
  const links = {
    first: `${process.env.BASE_URL}?page=1&limit=${limit}`,
    previous:
      page > 1
        ? `${process.env.BASE_URL}?page=${page - 1}&limit=${limit}`
        : null,
    next:
      page < totalPages
        ? `${process.env.BASE_URL}?page=${page + 1}&limit=${limit}`
        : null,
    last: `${process.env.BASE_URL}?page=${totalPages}&limit=${limit}`,
  };

  return {
    items,
    meta: {
      totalItems,
      itemCount: items.length,
      itemsPerPage: limit,
      totalPages: totalPages,
      currentPage: page,
    },
    links,
  };
}
