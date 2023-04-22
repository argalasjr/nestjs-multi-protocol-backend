import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendee } from './attendee.entity';
import { CreateAttendeeDto } from './input/create-attendee.dto';

@Injectable()
export class AttendeesService {
  constructor(
    @InjectRepository(Attendee)
    private readonly attendeeRepository: Repository<Attendee>,
  ) {}

  public async findByEventId(eventId: number): Promise<Attendee[]> {
    return this.attendeeRepository.find({
      where: { id: eventId },
    });
  }

  public async findOneByUserIdAndEventId(
    userId: number,
    eventId: number,
  ): Promise<Attendee | undefined> {
    return this.attendeeRepository.findOne({
      where: { event: { id: eventId }, user: { id: userId } },
    });
  }

  public async createOrUpdate(
    input: CreateAttendeeDto,
    eventId: number,
    userId: number,
  ): Promise<Attendee> {
    const attendee =
      (await this.findOneByUserIdAndEventId(userId, eventId)) ?? new Attendee();

    attendee.eventId = eventId;
    attendee.userId = userId;
    attendee.answer = input.answer;

    return await this.attendeeRepository.save(attendee);
  }
}
