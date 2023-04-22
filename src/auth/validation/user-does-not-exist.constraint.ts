import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Repository } from 'typeorm';
import { User } from '../user.entity';

@Injectable()
@ValidatorConstraint({ async: true })
export class UserDoesNotExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}
  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    return (
      (await this.userRepository.findOneBy({ [args.property]: value })) === null
    );
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} already taken`;
  }
}

export function UserDoesNotExist(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: UserDoesNotExistConstraint,
    });
  };
}
