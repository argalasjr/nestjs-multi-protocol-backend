import { Expose } from 'class-transformer';
import { User } from '../auth/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Event } from './event.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

export enum AttendeeAnswerEnum {
  Accepted = 1,
  Maybe,
  Rejected,
}

@Entity()
@ObjectType()
export class Attendee {
  @PrimaryGeneratedColumn()
  @Expose()
  @Field(() => Int)
  id: number;

  @ManyToOne(() => Event, (event) => event.attendees, { nullable: false })
  @JoinColumn({ name: 'event_id' })
  @Field(() => Event, { nullable: false })
  event: Event;

  @Column()
  @Field(() => Int)
  eventId: number;

  @Column('enum', {
    enum: AttendeeAnswerEnum,
    default: AttendeeAnswerEnum.Accepted,
  })
  @Expose()
  @Field()
  answer: AttendeeAnswerEnum;

  @ManyToOne(() => User, (user) => user.attended, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @Expose()
  @Field(() => User, { nullable: false })
  user: User;

  @Column()
  @Field(() => Int)
  userId: number;
}
