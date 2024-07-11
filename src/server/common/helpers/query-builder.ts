import { FindManyOptions, SelectQueryBuilder } from 'typeorm';

import {
  PAGESIZE_DEFAULT,
  PAGE_DEFAULT,
  SORT_DEFAULT,
  ORDER_DEFAULT,
} from '../constants/app';

interface QueryFilterProps {
  sortDefault?: string;
  orderDefault?: string;
  pageSizeDefault?: number;
}

export const buildQueryFilter = (
  query: any,
  options: QueryFilterProps = {
    sortDefault: SORT_DEFAULT,
    orderDefault: ORDER_DEFAULT,
    pageSizeDefault: PAGESIZE_DEFAULT,
  },
) => {
  const qr: FindManyOptions = {};
  qr.take = query.hasOwnProperty('pageSize')
    ? query.pageSize
    : options.pageSizeDefault;
  if (qr.take > 100) {
    qr.take = 100;
  }
  const page = query.hasOwnProperty('page') ? query.page : PAGE_DEFAULT;
  qr.skip = (page - 1) * qr.take;
  qr.where = {};
  Object.entries(query)
    .filter(([key]) => !['sort', 'order', 'pageSize', 'page'].includes(key))
    .forEach(([key, val]) => (qr.where[key] = val));
  if (query.sort) {
    qr.order = {
      [query.sort]: query.order ?? 'ASC',
    };
  } else {
    qr.order = {
      [options.sortDefault]: options.orderDefault,
    };
  }
  return qr;
};

export const buildQueryBuilder = <T>(qb: SelectQueryBuilder<T>, query: any) => {
  let pageSize = query.hasOwnProperty('pageSize')
      ? query.pageSize
      : PAGESIZE_DEFAULT,
    offset =
      ((query.hasOwnProperty('page') ? query.page : PAGE_DEFAULT) - 1) *
      pageSize;
  if (pageSize > 100) {
    pageSize = 100;
  }
  qb.take(pageSize);
  qb.skip(offset);
  delete query.pageSize;
  delete query.page;

  if (query.hasOwnProperty('sort')) {
    qb.orderBy(`"${query.sort}"`, query.order ?? 'ASC');
  } else {
    qb.orderBy(`"${SORT_DEFAULT}"`, ORDER_DEFAULT);
  }
  delete query.order;
  delete query.sort;
  return qb;
};
