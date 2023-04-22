import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateEventDto } from './input/create-event.dto';
import { EventsService } from './events.service';
import { UpdateEventDto } from './input/update-event.dto';
import { ListEvents } from './input/list.event';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';

@Controller('/events')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventsController {
  private readonly logger = new Logger(EventsController.name);

  constructor(private readonly eventService: EventsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(ClassSerializerInterceptor)
  async findAll(@Query() filter: ListEvents) {
    const events =
      await this.eventService.getEventsWithAttendeeCountFilteredPaginated(
        filter,
        {
          limit: 2,
          total: true,
          currentPage: filter.page,
        },
      );
    //this.logger.debug(`Found ${events.length} events`);
    return events;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // console.log(typeof id);
    const event = await this.eventService.getEventWithAttendeeCount(id);

    if (!event) {
      throw new NotFoundException();
    }

    return event;
  }

  // You can also use the @UsePipes decorator to enable pipes.
  // It can be done per method, or for every method when you
  // add it at the controller level.
  @Post()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async create(@Body() input: CreateEventDto, @CurrentUser() user: User) {
    return await this, this.eventService.createEvent(input, user);
  }

  // Create new ValidationPipe to specify validation group inside @Body
  // new ValidationPipe({ groups: ['update'] })
  @Patch(':id')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateEventDto,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventService.findOne(id);

    if (!event) {
      throw new NotFoundException();
    }

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'You are not the organizer');
    }

    return await this.eventService.updateEvent(event, input);
  }

  @Delete(':id')
  @UseGuards(AuthGuardJwt)
  @HttpCode(204)
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    const event = await this.eventService.findOne(id);

    if (event.organizerId !== user.id) {
      throw new ForbiddenException(null, 'You are not the organizer');
    }
    const result = await this.eventService.deleteEvent(id);

    if (result?.affected === 0) {
      throw new NotFoundException();
    }
  }
}
