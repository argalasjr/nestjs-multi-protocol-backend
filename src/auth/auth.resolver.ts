import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './Input/login.input';
import { TokenOutput } from './token.output';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => TokenOutput, { name: 'login' })
  public async login(
    @Args('input', { type: () => LoginInput }) loginInput: LoginInput,
  ): Promise<TokenOutput> {
    return new TokenOutput({
      token: this.authService.getTokenForUser(
        await this.authService.validateUser(
          loginInput.username,
          loginInput.password,
        ),
      ),
    });
  }
}
