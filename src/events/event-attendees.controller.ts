import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { AttendeesService } from './attendees.service';

@Controller('event/:eventId/attendees')
@SerializeOptions({ strategy: 'excludeAll' })
export class EventAttendeesController {
  constructor(private readonly attendeesService: AttendeesService) {}

  @Get(':eventId/attendees')
  @UseInterceptors(ClassSerializerInterceptor)
  public async findAll(@Param('eventId', ParseIntPipe) eventId: number) {
    return await this.attendeesService.findByEventId(eventId);
  }
}
