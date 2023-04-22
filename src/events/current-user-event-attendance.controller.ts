import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  DefaultValuePipe,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Query,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../auth/user.entity';
import { AttendeesService } from './attendees.service';
import { EventsService } from './events.service';
import { CreateAttendeeDto } from './input/create-attendee.dto';

@Controller('current-user-event-attendance')
@SerializeOptions({ strategy: 'excludeAll' })
export class CurrentUserEventAttendanceController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeesService: AttendeesService,
  ) {}

  @Get()
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  public async findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
  ) {
    return await this.eventsService.getEventsAttendedByUserIdPaginated(
      user.id,
      {
        currentPage: page,
        limit: 5,
      },
    );
  }

  @Get(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  public async findOne(
    @Param('eventId', ParseIntPipe) eventId: number,
    @CurrentUser() user: User,
  ) {
    const attendee = await this.attendeesService.findOneByUserIdAndEventId(
      user.id,
      eventId,
    );

    if (!attendee) {
      throw new NotFoundException();
    }

    return attendee;
  }

  @Put(':eventId')
  @UseGuards(AuthGuardJwt)
  @UseInterceptors(ClassSerializerInterceptor)
  public async createOrUpdate(
    @Param('eventId', ParseIntPipe) eventId: number,
    @Body() input: CreateAttendeeDto,
    @CurrentUser() user: User,
  ) {
    return await this.attendeesService.createOrUpdate(input, eventId, user.id);
  }
}
