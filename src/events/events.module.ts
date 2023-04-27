import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendee } from './attendee.entity';
import { AttendeeResolver } from './attendee.resolver';
import { AttendeesService } from './attendees.service';
import { CurrentUserEventAttendanceController } from './current-user-event-attendance.controller';
import { EventAttendeesController } from './event-attendees.controller';
import { Event } from './event.entity';
import { EventsOrganizedByUserController } from './events-organized-by-user.controller';
import { EventsController } from './events.controller';
import { EventsResolver } from './events.resolver';
import { EventsService } from './events.service';
import { EventsGrpcController } from './events-grpc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Attendee])],
  controllers: [
    EventsController,
    EventsGrpcController,
    EventAttendeesController,
    EventsOrganizedByUserController,
    CurrentUserEventAttendanceController,
  ],
  providers: [
    EventsService,
    AttendeesService,
    EventsResolver,
    AttendeeResolver,
  ],
})
export class EventsModule {}
