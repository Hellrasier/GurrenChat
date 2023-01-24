import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: UserDto) {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  async login(@Body() body: UserDto) {
    return this.authService.login(body.username, body.password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('profile')
  async profile(@Req() req: any) {
    return req.user;
  }
}
