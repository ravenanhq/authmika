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
import { LoginDto, LoginSuccessDto, QuickSignInDto } from '../dto/login.dto';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
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

  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiExcludeEndpoint()
  @Post('quick-sign-in-url')
  getQuickSignInUrl(@Body() body: QuickSignInDto) {
    return this.authService.quickSignIn(body.userId, body.applicationId);
  }
}
