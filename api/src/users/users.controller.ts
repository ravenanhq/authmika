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
} from '@nestjs/common';
import { UsersDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers() {
    return this.userService.getUsers();
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

  @Delete(':id')
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.userService.deleteUser(id);
  }
}
