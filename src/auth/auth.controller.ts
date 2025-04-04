import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body() body: { email: string; name: string; password: string },
  ) {
    return this.usersService.create(body);
  }

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getMyself(@Request() req) {
    const idUser = Number.parseInt(req.user.id);
    return this.usersService.findById(idUser, idUser);
  }
}
