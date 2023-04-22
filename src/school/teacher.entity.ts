import { Field, ObjectType } from '@nestjs/graphql';
import { Paginated } from '../pagination/paginator';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Gender } from './school.types';
import { Subject } from './subject.entity';

@Entity()
@ObjectType()
export class Teacher {
  constructor(partial?: Partial<Teacher>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  @Field({ nullable: true })
  id: number;

  @Column()
  @Field({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.Other,
  })
  @Field(() => Gender)
  gender: Gender;

  @ManyToMany(() => Subject, (subject) => subject.teachers)
  @Field(() => [Subject])
  subjects: Promise<Subject[]>;

  @OneToMany(() => Course, (course) => course.subject)
  @Field(() => [Course], { nullable: false })
  courses: Promise<Course[]>;
}
@ObjectType()
export class PaginatedTeachers extends Paginated<Teacher>(Teacher) {}
