import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { CreateUserDto } from './Input/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.userRepository.save(
      new User({
        ...createUserDto,
        password: await this.authService.hashPassword(createUserDto.password),
      }),
    );
  }
}
