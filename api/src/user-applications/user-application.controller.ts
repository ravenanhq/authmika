import {
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  Body,
  UseGuards,
} from '@nestjs/common';

import { UserApplicationService } from './user-applications.service';
import { AuthGuard } from '@nestjs/passport';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  UserApplicationCreateBodyDto,
  UserApplicationCreateDto,
  UserApplicationDeleteBodyDto,
  UserApplicationDeleteSuccessDto,
  UserApplicationGetBodyDto,
  UserApplicationGetSuccessDto,
} from './dto/user-application.dto';

@Controller('user-applications')
export class UserApplicationsController {
  constructor(
    private readonly userapplicationService: UserApplicationService,
  ) {}

  @ApiTags('User Applications')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserApplicationCreateDto,
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
  @ApiOperation({ summary: 'Assign a user to application' })
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() body: UserApplicationCreateBodyDto) {
    return this.userapplicationService.create(body.userId, body.applicationId);
  }

  @ApiTags('User Applications')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserApplicationGetSuccessDto,
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
  @ApiOperation({ summary: 'Get all user applications by user id' })
  @Post('get-user-applications')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getApplicationsByUserId(
    @Body() requestBody: UserApplicationGetBodyDto,
  ): Promise<UserApplicationGetSuccessDto> {
    try {
      const userApplications =
        await this.userapplicationService.getApplicationsByUserId(
          requestBody.userId,
        );
      return userApplications;
    } catch (error) {
      throw new Error(`Error fetching user applications: ${error.message}`);
    }
  }

  @ApiTags('User Applications')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UserApplicationDeleteSuccessDto,
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
  @ApiOperation({ summary: 'Delete user application mapping' })
  @Post('delete-applications')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async deleteUserApplicationMapping(
    @Body() requestBody: UserApplicationDeleteBodyDto,
  ): Promise<UserApplicationDeleteSuccessDto> {
    try {
      const userApplications =
        await this.userapplicationService.deleteUserApplicationMapping(
          requestBody.userId,
          requestBody.applicationId,
        );
      return userApplications;
    } catch (error) {
      throw new Error(`Error fetching user applications: ${error.message}`);
    }
  }
}
