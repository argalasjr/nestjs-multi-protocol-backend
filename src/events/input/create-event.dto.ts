import { Field, InputType } from '@nestjs/graphql';
import { IsDateString, IsString, Length } from 'class-validator';

@InputType()
export class CreateEventDto {
  @IsString()
  @Length(5, 255, { message: 'The name length is wrong' })
  @Field()
  name: string;

  @Length(5, 255)
  @Field()
  description: string;

  @IsDateString()
  @Field()
  when: string;

  @Length(5, 255)
  @Field()
  address: string;
}
