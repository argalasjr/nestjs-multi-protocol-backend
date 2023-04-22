import { User } from '../auth/user.entity';
import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ListEvents } from './input/list.event';

describe('EventsController', () => {
  let eventService: EventsService;
  let eventController: EventsController;
  let eventRepository: Repository<Event>;

  beforeEach(async () => {
    eventService = new EventsService(eventRepository);
    eventController = new EventsController(eventService);
  });

  it('should return paginated result', async () => {
    const result = {
      first: 1,
      last: 1,
      limit: 10,
      data: [],
    };

    // mock implementation of method of service which dont want to be tested now
    // eventService.getEventsWithAttendeeCountFilteredPaginated = jest
    //   .fn()
    //   .mockImplementation(() => result);

    const spy = jest
      .spyOn(eventService, 'getEventsWithAttendeeCountFilteredPaginated')
      .mockImplementation((): any => result);
    expect(await eventController.findAll(new ListEvents())).toEqual(result);
    expect(spy).toBeCalledTimes(1);
  });

  it('should not delete an event when its not found', async () => {
    // mock implementation of method of service which dont want to be tested now
    // eventService.getEventsWithAttendeeCountFilteredPaginated = jest
    //   .fn()
    //   .mockImplementation(() => result);

    const deleteSpy = jest.spyOn(eventService, 'deleteEvent');

    const findSpy = jest
      .spyOn(eventService, 'findOne')
      .mockImplementation((): any => undefined);

    try {
      await eventController.remove(1, new User());
    } catch (error: any) {
      //expect(error).toBeInstanceOf(NotFoundException);
    }

    expect(deleteSpy).toBeCalledTimes(0);
    expect(findSpy).toBeCalledTimes(1);
  });
});
