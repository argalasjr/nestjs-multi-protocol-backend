import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { EventsService } from './events.service';
import { UpdateEventDto, UpdateEventDtoWithId } from './input/update-event.dto';
import { ListEvents } from './input/list.event';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { GrpcMethod } from '@nestjs/microservices';
import { Event, PaginatedEvents } from './event.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthGuardJwtGrpc } from 'src/auth/auth-guar.jwt.grpc';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsGrpcController {
  private readonly logger = new Logger(EventsGrpcController.name);

  constructor(
    @InjectRepository(Event)
    private readonly eventsRepo: Repository<Event>,
    private readonly eventService: EventsService,
  ) {}

  @GrpcMethod('AppController', 'findEvents')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findEvents(@Query() filter: ListEvents): Promise<PaginatedEvents> {
    const events =
      await this.eventService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          limit: 2,
          total: true,
          currentPage: filter.page,
        },
      );
    console.log(events);
    return events;
  }

  @GrpcMethod('AppController', 'findEvent')
  @UseInterceptors(ClassSerializerInterceptor)
  async findEvent(id: number): Promise<Event> {
    return await this.eventsRepo.findOneOrFail({
      where: { id },
    });
  }

  // You can also use the @UsePipes decorator to enable pipes.
  // It can be done per method, or for every method when you
  // add it at the controller level.
  @GrpcMethod('AppController', 'createEvent')
  @UseGuards(AuthGuardJwtGrpc)
  @UseInterceptors(ClassSerializerInterceptor)
  async createEvent(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    console.log(input);
    return await this, this.eventService.createEvent(input, user);
  }

  // Create new ValidationPipe to specify validation group inside @Body
  // new ValidationPipe({ groups: ['update'] })
  @GrpcMethod('AppController', 'updateEvent')
  @UseGuards(AuthGuardJwtGrpc)
  @UseInterceptors(ClassSerializerInterceptor)
  async updateEvent(
    @Body() input: UpdateEventDtoWithId,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventService.findOne(input.id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'You are not the organizer');
    }

    return await this.eventService.updateEvent(event, input);
  }

  @GrpcMethod('AppController', 'deleteEvent')
  @UseGuards(AuthGuardJwtGrpc)
  @HttpCode(204)
  async deleteEvent(
    @Body() toDelete: { id: number },
    @CurrentUser() user: User,
  ) {
    const event = await this.eventService.findOne(toDelete.id);

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'You are not the organizer');
    }
    const result = await this.eventService.deleteEvent(toDelete.id);

    if (result?.affected === 0) {
      throw new NotFoundException();
    }
  }
}
