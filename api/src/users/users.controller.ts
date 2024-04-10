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
} from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

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
    @Request() req,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.create(usersDto, req.user);
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

  @Delete(':id')
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.deleteUser(id);
  }
}
