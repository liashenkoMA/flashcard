import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../user/user.schema.dto';
import { ROUTES } from '../../shared/constants/routes.constant';

@Controller(ROUTES.AUTH)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(ROUTES.SIGN_IN)
  signIn(@Body() user: LoginUserDto) {
    const { email, password } = user;
    return this.authService.signIn(email, password);
  }
}
