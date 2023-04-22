import { Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuardJwtGql } from '../auth/auth-guard.jwt.gql';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { PaginationInput } from '../pagination/pagination.input';
import { paginate } from '../pagination/paginator';
import { EntityWithId } from '../school/school.types';
import { Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { Event, PaginatedEvents } from './event.entity';
import { CreateEventDto } from './input/create-event.dto';

@Resolver(() => Event)
export class EventsResolver {
  private readonly logger = new Logger(EventsResolver.name);
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
  ) {}

  @Query(() => PaginatedEvents)
  public async events(
    @Args('input', { nullable: true, type: () => PaginationInput })
    input?: PaginationInput,
  ): Promise<PaginatedEvents> {
    return paginate<Event, PaginatedEvents>(
      this.eventsRepo.createQueryBuilder(),
      PaginatedEvents,
      input ?? undefined,
    );
  }

  @Query(() => Event)
  @UseGuards(AuthGuardJwtGql)
  public async event(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<Event> {
    return await this.eventsRepo.findOneOrFail({
      where: { id },
    });
  }

  @Mutation(() => Event, { name: 'createEvent' })
  @UseGuards(AuthGuardJwtGql)
  public async add(
    @Args('input', { type: () => CreateEventDto }) input: CreateEventDto,
    @CurrentUser() user: User,
  ): Promise<Event> {
    this.logger.debug(`current user: ${user.username}`);
    return await this.eventsRepo.save(
      new Event({
        ...input,
        organizer: Promise.resolve(user),
        when: new Date(input.when),
      }),
    );
  }

  @Mutation(() => EntityWithId, { name: 'eventDelete' })
  public async delete(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<EntityWithId> {
    const teacher = await this.eventsRepo.findOneOrFail({
      where: { id },
    });
    await this.eventsRepo.remove(teacher);
    return new EntityWithId(id);
  }

  @ResolveField('attendees')
  public async organizer(@Parent() event: Event): Promise<Attendee[]> {
    this.logger.debug('event resolver called for attendees');
    return await event.attendees;
  }
}
