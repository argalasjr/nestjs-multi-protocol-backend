import { Logger, UseGuards } from '@nestjs/common';
import {
  Resolver,
  Query,
  Args,
  Int,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthGuardJwtGql } from '../auth/auth-guard.jwt.gql';
import { TeachearAddInput } from './input/teacher-add.input';
import { TeacherEditInput } from './input/teacher-edit.input';
import { EntityWithId } from './school.types';
import { PaginatedTeachers, Teacher } from './teacher.entity';
import { paginate } from '../pagination/paginator';
import { PaginationInput } from '../pagination/pagination.input';

@Resolver(() => Teacher)
export class TeacherResolver {
  private readonly logger = new Logger(TeacherResolver.name);
  constructor(
    @InjectRepository(Teacher)
    private readonly teachersRepo: Repository<Teacher>,
  ) {}
  @Query(() => PaginatedTeachers)
  public async teachers(
    @Args('input', { nullable: true, type: () => PaginationInput })
    input?: PaginationInput,
  ): Promise<PaginatedTeachers> {
    return paginate<Teacher, PaginatedTeachers>(
      this.teachersRepo.createQueryBuilder(),
      PaginatedTeachers,
      input ?? undefined,
    );
  }

  @Query(() => Teacher)
  @UseGuards(AuthGuardJwtGql)
  public async teacher(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Teacher> {
    return await this.teachersRepo.findOneOrFail({
      where: { id },
    });
  }

  @Mutation(() => Teacher, { name: 'teacherAdd' })
  @UseGuards(AuthGuardJwtGql)
  public async add(
    @Args('input', { type: () => TeachearAddInput }) input: TeachearAddInput,
  ): Promise<Teacher> {
    return await this.teachersRepo.save(new Teacher(input));
  }

  @Mutation(() => Teacher, { name: 'teacherEdit' })
  public async edit(
    @Args('id', { type: () => Int }) id: number,
    @Args('input', { type: () => TeacherEditInput }) input: TeacherEditInput,
  ): Promise<Teacher> {
    const teacher = await this.teachersRepo.findOneOrFail({
      where: { id },
    });
    console.log(teacher);
    return await this.teachersRepo.save(
      new Teacher(Object.assign(teacher, input)),
    );
  }

  @Mutation(() => EntityWithId, { name: 'teacherDelete' })
  public async delete(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<EntityWithId> {
    const teacher = await this.teachersRepo.findOneOrFail({
      where: { id },
    });
    await this.teachersRepo.remove(teacher);
    return new EntityWithId(id);
  }

  @ResolveField('subjects')
  public async subjects(@Parent() teacher: Teacher) {
    const subject = await teacher.subjects;
    this.logger.debug('subjects resolver called', subject[0].name);
    return subject;
  }
}
