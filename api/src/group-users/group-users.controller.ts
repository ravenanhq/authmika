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
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GroupUsersData,
  GroupUserApplicationGetSuccessDto,
  GroupApplicationGetSuccessDto,
  GroupApplicationGetBodyDto,
  GroupApplicationCreateDto,
  GroupApplicationCreateBodyDto,
  AssignUserstoGroupBodyDto,
  GroupUserApplicationGetResSuccessDto,
} from './dto/group-users.dto';

@Controller('group-users')
export class GroupUsersController {
  constructor(private readonly groupusersService: GroupUsersService) {}

  @ApiTags('Group-Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GroupUsersData,
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
  @ApiOperation({ summary: 'Get all group-users' })
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

  @ApiBearerAuth()
  @ApiExcludeEndpoint()
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: AssignUserstoGroupBodyDto) {
    return this.groupusersService.createUser(body.groupId, body.userId);
  }

  @ApiTags('Group-Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GroupUserApplicationGetResSuccessDto,
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
  @ApiOperation({ summary: 'Get user by group id' })
  @Post('get-group-users')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getUserListByGroupId(
    @Body() requestBody: GroupUserApplicationGetSuccessDto,
  ): Promise<GroupUserApplicationGetSuccessDto> {
    try {
      const userGroups = await this.groupusersService.getUsersByGroupId(
        requestBody.groupId,
      );
      return userGroups;
    } catch (error) {
      throw new Error(`Error fetching user groups: ${error.message}`);
    }
  }

  @ApiTags('Group-Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GroupApplicationGetSuccessDto,
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
  @ApiOperation({ summary: 'Get all applications by group id' })
  @Post('get-group-applications')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getApplicationListByGroupId(
    @Body() requestBody: GroupApplicationGetBodyDto,
  ): Promise<GroupApplicationGetSuccessDto> {
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

  @ApiTags('Group-Users')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GroupApplicationCreateDto,
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
  @ApiOperation({ summary: 'Assign applications to group' })
  @Post('assign-user-and-application')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async createApp(@Body() body: GroupApplicationCreateBodyDto) {
    return this.groupusersService.userAndApplicationAssigning(
      body.groupId,
      body.userId,
      body.applicationId,
    );
  }
}
