import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GroupUsersService } from './group-users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('group-users')
export class GroupUsersController {
  constructor(private readonly groupusersService: GroupUsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getAllUsers() {
    try {
      const users = await this.groupusersService.getUsers();
      return users;
    } catch (error) {
      console.error('Error fetching  users:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body('groupId') groupId: number,
    @Body('userId') userId: Array<number>,
  ) {
    return this.groupusersService.createUser(groupId, userId);
  }

  @Post('get-group-users')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getUserListByGroupId(
    @Body() requestBody: { groupId: number },
  ): Promise<{
    groupId?: number;
    userId?: number;
  }> {
    try {
      const userGroups = await this.groupusersService.getUsersByGroupId(
        requestBody.groupId,
      );
      return userGroups;
    } catch (error) {
      throw new Error(`Error fetching user groups: ${error.message}`);
    }
  }

  @Post('get-group-applications')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getApplicationListByGroupId(
    @Body() requestBody: { groupId: number },
  ): Promise<{
    groupId?: number;
    id?: number;
  }> {
    try {
      const userApplications =
        await this.groupusersService.getApplicationsByGroupId(
          requestBody.groupId,
        );
      return userApplications;
    } catch (error) {
      throw new Error(`Error fetching user applications: ${error.message}`);
    }
  }

  @Post('assign-application')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async createApp(
    @Body('groupId') groupId: number,
    @Body('applicationId') applicationId: Array<number>,
  ) {
    return this.groupusersService.createApplication(groupId, applicationId);
  }
}
