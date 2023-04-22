import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subject } from './subject.entity';
import { Teacher } from './teacher.entity';

@Entity()
@ObjectType()
export class Course {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { nullable: true })
  id: number;

  @ManyToOne(() => Subject, (subject) => subject.courses)
  @Field(() => Subject, { nullable: false })
  subject: Promise<Subject>;

  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @Field(() => Subject, { nullable: false })
  teacher: Promise<Teacher>;
}
