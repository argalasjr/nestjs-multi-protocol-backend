import { Logger } from '@nestjs/common';
import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Attendee } from '../events/attendee.entity';
import { Event } from './event.entity';

@Resolver(() => Attendee)
export class AttendeeResolver {
  private readonly logger = new Logger(AttendeeResolver.name);
  @ResolveField('event')
  public async event(@Parent() attendee: Attendee): Promise<Event> {
    this.logger.debug('attendee resolver called');
    return await attendee.event;
  }
}
