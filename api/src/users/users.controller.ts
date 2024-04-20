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
} from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('qrcode/:id')
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
  async verifyCurrentPassword(
    @Body() usersDto: UsersDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    const { currentPassword } = req.body;
    return this.userService.verifyCurrentPassword(
      usersDto,
      req.user,
      id,
      currentPassword,
    );
  }
  @Post('check-password/:id')
  async checkPassword(
    @Body() requestBody: { password: string; confirmPassword: string },
    @Param('id') id: number,
  ) {
    try {
      const result = await this.userService.checkPassword(
        id,
        requestBody.password,
        requestBody.confirmPassword,
      );
      return result;
    } catch (error) {
      return { message: 'An error occurred', statusCode: 500 };
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async show(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.show(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
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
  async verifyOtp(
    @Param('id') id: number,
    @Param('otp') otp: string,
  ): Promise<{ success: boolean }> {
    try {
      const isOtpMatch = await this.userService.verifyOtp(id, otp);
      return { success: isOtpMatch };
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { success: false };
      } else {
        throw error;
      }
    }
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.deleteUser(id);
  }
}
