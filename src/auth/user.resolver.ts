import { Logger, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Event } from '../events/event.entity';
import { AuthGuardJwtGql } from './auth-guard.jwt.gql';
import { CurrentUser } from './current-user.decorator';
import { CreateUserDto } from './Input/create-user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  private readonly logger = new Logger(UserResolver.name);
  constructor(private readonly userService: UserService) {}
  @Query(() => User, { nullable: true })
  @UseGuards(AuthGuardJwtGql)
  public async me(@CurrentUser() user: User): Promise<User> {
    console.log(user);
    return user;
  }

  @Mutation(() => User, { name: 'userAdd' })
  public async add(@Args('input') input: CreateUserDto): Promise<User> {
    return await this.userService.create(input);
  }

  @ResolveField('organized', () => [Event])
  public async organized(@Parent() user: User): Promise<Event[]> {
    this.logger.debug('user resolver called for organized');
    return await user.organized;
  }
}
