import { Type } from '@nestjs/common';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Expose } from 'class-transformer';
import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  limit?: number;
  currentPage?: number;
  total?: boolean;
}
export function Paginated<T>(classRef: Type<T>) {
  @ObjectType()
  class PaginationResult<T> {
    constructor(partial: Partial<PaginationResult<T>>) {
      Object.assign(this, partial);
    }
    @Expose()
    @Field()
    first: number;
    @Expose()
    @Field()
    last: number;
    @Expose()
    @Field()
    limit: number;
    @Expose()
    @Field(() => Int, { nullable: true })
    total: number;
    @Expose()
    @Field(() => [classRef], { nullable: true })
    data: T[];
  }
  return PaginationResult<T>;
}

export async function paginate<T, K>(
  qb: SelectQueryBuilder<T>,
  classRef: Type<K>,
  options: PaginateOptions = { limit: 10, currentPage: 1 },
): Promise<K> {
  const offset = (options.currentPage - 1) * options.limit;

  const data = await qb.limit(options.limit).offset(offset).getMany();

  return new classRef({
    first: offset + 1,
    last: offset + data.length,
    limit: options.limit,
    total: options?.total ? await qb.getCount() : null,
    data,
  });
}
