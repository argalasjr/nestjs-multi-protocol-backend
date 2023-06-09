import {
  Controller,
  Post,
  UseGuards,
  Get,
  SerializeOptions,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuardLocal)
  async login(@CurrentUser() user) {
    return {
      userId: user.id,
      token: this.authService.getTokenForUser(user),
    };
  }

  @Get('profile')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuardJwt)
  async getProfile(@CurrentUser() user) {
    return user;
  }
}
