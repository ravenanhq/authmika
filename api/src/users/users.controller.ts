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
import {
  AddUserByApi,
  AddUserByApiSuccessDto,
  AddUsersDto,
  AddUserSuccessDto,
  CreatePasswordSuccessDto,
  DeactivateUserSuccessDto,
  DeleteUserSuccessDto,
  GetUserSuccessDto,
  ResendActivationEmailDataDto,
  ResendActivationEmailSuccessDto,
  ResendOtpParams,
  SavePasswordBodyDto,
  UpdatePasswordDataDto,
  UpdatePasswordSuccessDto,
  UpdateUserSuccessDto,
  UserActivationQueryParamsDto,
  UserActivationSuccessDto,
  UsersDto,
  VerifyCurrentPasswordDataDto,
  VerifyCurrentPasswordSuccessDto,
  VerifyOtpSuccessDto,
} from './dto/users.dto';
import { UsersService } from './users.service';
import {
  ResetPasswordDto,
  ResetPasswordSuccessDto,
} from 'src/auth/dto/reset-password.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserDataDto } from 'src/auth/dto/login.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOperation({ summary: 'Get qr code' })
  @ApiExcludeEndpoint()
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

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserDataDto,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiOperation({ summary: 'Get users' })
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

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: AddUserSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() usersDto: AddUsersDto): Promise<AddUserSuccessDto> {
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

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: VerifyCurrentPasswordSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 422,
    description: 'Current password is incorrect',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Verify current password' })
  @Post('verify-current-password/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async verifyCurrentPassword(
    @Body() body: VerifyCurrentPasswordDataDto,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    const { currentPassword } = body;
    return this.userService.verifyCurrentPassword(id, currentPassword);
  }

  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreatePasswordSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 410,
    description: 'Gone',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Create a password' })
  @Get('create-password/:token')
  @HttpCode(HttpStatus.OK)
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

  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserActivationSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 410,
    description: 'Gone',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Activate a user' })
  @Get('active-users/:token')
  @HttpCode(HttpStatus.OK)
  async aciveUsers(
    @Param('token') token: string,
    @Query() queryParams: UserActivationQueryParamsDto,
  ) {
    try {
      const result = await this.userService.acitiveUsers(
        token,
        queryParams.expires,
      );
      return result;
    } catch (error) {
      return { message: 'An error occurred', statusCode: 500 };
    }
  }

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetUserSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Get a user by id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async show(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.show(id);
  }

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UpdateUserSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Update a user by id' })
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

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UpdatePasswordSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Update password by id' })
  @Post('update-password/:id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async updatePassword(
    @Body() data: UpdatePasswordDataDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.updatePassword(data, req.user, id);
  }

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: AddUserByApiSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Create user from api' })
  @Post('create-from-api')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async createFromApi(
    @Body() data: AddUserByApi,
    @Request() req,
  ): Promise<{
    message: string;
    statusCode: number;
  }> {
    return this.userService.createFromApi(data, req.user);
  }

  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @Post('verify-otp/:id/:otp')
  @UseGuards(AuthGuard('jwt'))
  async verifyOtp(
    @Param('id') id: number,
    @Param('otp') otp: string,
  ): Promise<VerifyOtpSuccessDto> {
    try {
      const result = await this.userService.verifyOtp(id, otp);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return {
          success: false,
          message: error.message || 'An error occurred while verifying OTP',
        };
      } else {
        throw error;
      }
    }
  }

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResendActivationEmailSuccessDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Resend user activation link to user' })
  @Post('send-resend-link')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  async sendResendLinkToUser(
    @Body() body: ResendActivationEmailDataDto,
  ): Promise<{
    message: string;
    statusCode: number;
  }> {
    return this.userService.sendResendLinkToUser(
      body.email,
      body.firstName,
      body.lastName,
    );
  }

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResetPasswordSuccessDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Save user password' })
  @Post('save-password')
  @UseGuards(AuthGuard('jwt'))
  async savePassword(
    @Body() body: SavePasswordBodyDto,
  ): Promise<{ message: string; error?: string }> {
    try {
      const result = await this.userService.savePassword(
        body.email,
        body.id,
        body.password,
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

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DeleteUserSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Delete a user by id' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number): Promise<DeleteUserSuccessDto> {
    return this.userService.deleteUser(id);
  }

  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @Post('resend-otp')
  @UseGuards(AuthGuard('jwt'))
  async resendOtp(@Body() body: ResendOtpParams) {
    try {
      const result = await this.userService.resendOtp(body);
      return result;
    } catch (error) {
      console.error('Error resending OTP:', error);
      return {
        success: false,
        message: 'An error occurred while resending OTP',
      };
    }
  }

  @ApiTags('Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DeactivateUserSuccessDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Deactivate user' })
  @Post('update-status/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateStatus(
    @Param('id') id: number,
  ): Promise<DeactivateUserSuccessDto> {
    return this.userService.updateStatus(id);
  }
}
