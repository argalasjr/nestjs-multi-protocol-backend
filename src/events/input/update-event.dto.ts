import { InputType } from '@nestjs/graphql';
import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

@InputType()
export class UpdateEventDto extends PartialType(CreateEventDto) {}

export class UpdateEventDtoWithId extends PartialType(CreateEventDto) {
  id: number;
}
