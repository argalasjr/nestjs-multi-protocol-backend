import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';
import { IsRepeated } from '../../validation/is-repeated.constraint';
import { UserDoesNotExist } from '../validation/user-does-not-exist.constraint';

@InputType('UserAddInput')
export class CreateUserDto {
  @Length(5)
  @UserDoesNotExist()
  @Field()
  username: string;

  @Length(8)
  @Field()
  password: string;

  @Length(8)
  @IsRepeated('password')
  @Field()
  retypedPassword: string;

  @Length(5)
  @UserDoesNotExist()
  @Field()
  email: string;

  @Length(5)
  @Field()
  firstName: string;

  @Length(5)
  @Field()
  lastName: string;
}
