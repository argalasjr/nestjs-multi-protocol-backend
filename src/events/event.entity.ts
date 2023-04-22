import { User } from '../auth/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Attendee } from './attendee.entity';
import { Expose } from 'class-transformer';
import { Paginated } from '../pagination/paginator';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Event {
  constructor(partial?: Partial<Event>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  @Expose()
  @Field()
  id: number;

  @Column()
  @Expose()
  @Field()
  name: string;

  @Column()
  @Expose()
  @Field()
  description: string;

  @Column()
  @Expose()
  @Field()
  when: Date;

  @Column()
  @Expose()
  @Field()
  address: string;

  @OneToMany(() => Attendee, (attendee) => attendee.event, {
    cascade: true,
  })
  @Expose()
  @Field(() => [Attendee], { nullable: false })
  attendees: Promise<Attendee[]>;

  @ManyToOne(() => User, (user) => user.organized)
  @Expose()
  @Field(() => User, { nullable: false })
  organizer: Promise<User>;

  @Column({ nullable: true })
  @Field()
  organizerId: number;

  // @Expose()
  // attendeeCount?: number;
  // @Expose()
  // attendeeRejected?: number;
  // @Expose()
  // attendeeMaybe?: number;
  // @Expose()
  // attendeeAccepted?: number;
}
@ObjectType()
export class PaginatedEvents extends Paginated<Event>(Event) {}
