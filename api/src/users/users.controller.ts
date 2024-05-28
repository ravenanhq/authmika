import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Request,
  Delete,
  Param,
  Put,
  HttpException,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { UsersService } from './users.service';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';

interface ResendOtpParams {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  url: string;
}

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('qrcode/:id')
  @UseGuards(AuthGuard('jwt'))
  async generateQRCodeDataUrl(
    @Query('is_two_factor_enabled') is_two_factor_enabled: string,
    @Param('id') id: number,
  ): Promise<string> {
    const qrCodeDataUrl = await this.userService.generateQRCodeDataUrl(
      id,
      is_two_factor_enabled,
    );
    return qrCodeDataUrl;
  }

  // @Get('verify-token/:id/:token')
  // async verifyToken(@Param('id') id: number, @Param('token') token: string) {
  //   try {
  //     const isValid = await this.userService.verifyToken(token, id);
  //     return isValid;
  //   } catch (error) {
  //     console.error('Error verifying token:', error);
  //     return { isValid: false };
  //   }
  // }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getUsers() {
    try {
      const activeUsers = await this.userService.getUsers();
      return activeUsers;
    } catch (error) {
      console.error('Error fetching active users:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() usersDto: UsersDto,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.create(usersDto);
  }

  // @Post('get-otp/:id')
  // @UsePipes(new ValidationPipe())
  // @HttpCode(HttpStatus.OK)
  // @UsePipes(new ValidationPipe())
  // async sendOtp(
  //   @Body() usersDto: UsersDto,
  //   @Request() req,
  //   @Param('id') id: number,
  // ): Promise<{ message: string; statusCode: number }> {
  //   return this.userService.sendOtp(usersDto, req.user, id);
  // }

  @Post('verify-current-password/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async verifyCurrentPassword(
    @Request() req,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    const { currentPassword } = req.body;
    return this.userService.verifyCurrentPassword(id, currentPassword);
  }

  @Get('create-password/:token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async createPassword(
    @Param('token') token: string,
    @Query() queryParams: ResetPasswordDto,
  ) {
    try {
      const result = await this.userService.createPassword(token, queryParams);
      return result;
    } catch (error) {
      return { message: 'An error occurred', statusCode: 500 };
    }
  }

  @Get('active-users/:token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async aciveUsers(@Param('token') token: string, @Query() expires: number) {
    try {
      const result = await this.userService.acitiveUsers(token, expires);
      return result;
    } catch (error) {
      return { message: 'An error occurred', statusCode: 500 };
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async show(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.show(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() usersDto: UsersDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.update(usersDto, req.user, id);
  }

  @Post('update-password/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async updatePassword(
    @Body() usersDto: UsersDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    const { currentPassword } = req.body;
    return this.userService.updatePassword(
      usersDto,
      req.user,
      id,
      currentPassword,
    );
  }

  @Post('create-from-api')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  async createFromApi(
    @Body() usersDto: UsersDto,
    @Body('clientSecretKey') clientSecretKey: any,
    @Body('clientSecretId') clientSecretId: any,
    @Request() req,
  ): Promise<{
    message: string;
    statusCode: number;
  }> {
    return this.userService.createFromApi(
      usersDto,
      clientSecretId,
      clientSecretKey,
      req.user,
    );
  }

  @Post('verify-otp/:id/:otp')
  @UseGuards(AuthGuard('jwt'))
  async verifyOtp(
    @Param('id') id: number,
    @Param('otp') otp: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.userService.verifyOtp(id, otp);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          success: false,
          error: error.message || 'An error occurred while verifying OTP',
        };
      } else {
        throw error;
      }
    }
  }

  @Post('send-resend-link')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  async sendResendLinkToUser(
    @Body('email') email: string,
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
  ): Promise<{
    message: string;
    statusCode: number;
  }> {
    return this.userService.sendResendLinkToUser(email, firstName, lastName);
  }

  @Post('save-password')
  @UseGuards(AuthGuard('jwt'))
  async savePassword(
    @Body('email') email: string,
    @Body('id') id: number,
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string; error?: string }> {
    try {
      const result = await this.userService.savePassword(
        email,
        id,
        resetPasswordDto,
      );
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          message: 'Failed to verify password',
          error: error.message || 'An error occurred while verifying password',
        };
      } else {
        throw error;
      }
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.deleteUser(id);
  }

  @Post('resend-otp')
  @UseGuards(AuthGuard('jwt'))
  async resendOtp(@Body() params: ResendOtpParams) {
    try {
      const result = await this.userService.resendOtp(params);
      return result;
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'An error occurred while resending OTP',
      };
    }
  }

  @Post('update-status/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.updateStatus(id);
  }
}
