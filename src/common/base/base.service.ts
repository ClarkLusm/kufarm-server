import { Injectable } from '@nestjs/common';
import {
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
  UpdateResult,
} from 'typeorm';

import { PAGESIZE_DEFAULT, PAGE_DEFAULT } from '../constants/app';

@Injectable()
export class BaseService<T extends ObjectLiteral> {
  constructor(public repository: Repository<T>) {}

  async getAll(
    query?: any,
    select?: FindOptionsSelect<T>,
    relations?: FindOptionsRelations<any>,
  ): Promise<[T[], number]> {
    const qr: FindManyOptions = {};
    qr.take = query?.hasOwnProperty('pageSize')
      ? query.pageSize
      : PAGESIZE_DEFAULT;
    const page = query?.hasOwnProperty('page') ? query.page : PAGE_DEFAULT;
    qr.skip = (page - 1) * qr.take;
    delete query?.pageSize;
    delete query?.page;
    qr.where = query;
    if (select) {
      qr.select = select;
    }
    if (relations) {
      qr.relations = relations;
    }
    if (query?.sort) {
      qr.order = {
        [query.sort]: query.order ?? 'ASC',
        updatedAt: 'DESC',
      };
      delete query.sort;
      delete query.order;
    }
    return this.repository.findAndCount(qr);
  }

  findAndCount = (query: any) => this.repository.findAndCount(query);

  find = (query: any) => this.repository.find(query);

  findBy = (query: any) => this.repository.findBy(query);

  getOne = (
    query: any,
    select?: FindOptionsSelect<T>,
    relations?: FindOptionsRelations<T>,
  ): Promise<T> => this.repository.findOne({ where: query, select, relations });

  findOne = (query: FindOneOptions): Promise<T> =>
    this.repository.findOne(query);

  findOneBy = (query: FindOptionsWhere<T>): Promise<T> =>
    this.repository.findOneBy(query);

  getById = (id: any): Promise<T> => this.repository.findOneBy({ id });

  updateById = (id: any, data: any): Promise<UpdateResult> =>
    this.repository.update(id, data);

  update = (condition: any, data: any): Promise<UpdateResult> =>
    this.repository.update({ ...condition }, data);

  create = (data: any): Promise<T> => this.repository.save(data);

  deleteById = (id: any): Promise<DeleteResult> =>
    this.repository.softDelete(id);

  delete = (condition: any): Promise<DeleteResult> =>
    this.repository.softDelete({ ...condition });

  count = (query: any) => this.repository.count(query);

  countBy = (query: any) => this.repository.countBy(query);
}
