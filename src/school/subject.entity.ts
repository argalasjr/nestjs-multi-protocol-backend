import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Course } from './course.entity';
import { Teacher } from './teacher.entity';

@Entity()
@ObjectType()
export class Subject {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Column()
  @Field()
  name: string;

  @ManyToMany(() => Teacher, (teacher) => teacher.subjects, { cascade: true })
  @JoinTable()
  teachers: Promise<Teacher[]>;

  @OneToMany(() => Course, (course) => course.subject)
  @Field(() => [Course], { nullable: false })
  courses: Promise<Course[]>;
}
