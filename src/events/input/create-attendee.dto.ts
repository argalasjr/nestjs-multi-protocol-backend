import { Field, InputType } from '@nestjs/graphql';
import { IsEnum } from 'class-validator';
import { AttendeeAnswerEnum } from '../attendee.entity';

@InputType()
export class CreateAttendeeDto {
  @IsEnum(AttendeeAnswerEnum)
  @Field()
  answer: AttendeeAnswerEnum;
}
