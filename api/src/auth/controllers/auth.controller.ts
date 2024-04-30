import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '../auth.guard';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @UsePipes(new ValidationPipe())
  signIn(@Body() loginDto: LoginDto) {
    return this.authService.signIn(
      loginDto.email,
      loginDto.password,
      loginDto.clientId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('quick-sign-in-url')
  getQuickSignInUrl(@Body() body: { userId: number; applicationId: number }) {
    return this.authService.quickSignIn(body.userId, body.applicationId);
  }
}
