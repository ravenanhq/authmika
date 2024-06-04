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
import {
  LoginDto,
  LoginSuccessDto,
  QuickSignInDto,
  QuickSignInSuccessDto,
  UserDataDto,
} from '../dto/login.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('Auth')
  @ApiResponse({
    status: 200,
    description: 'Logged in successfully',
    type: LoginSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiOperation({ summary: 'Login' })
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

  @ApiTags('Auth')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOperation({ summary: 'Logged in user profile' })
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiTags('Auth')
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: QuickSignInSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOperation({ summary: 'Get quick sign in url' })
  @Post('quick-sign-in-url')
  getQuickSignInUrl(@Body() body: QuickSignInDto) {
    return this.authService.quickSignIn(body.userId, body.applicationId);
  }
}
