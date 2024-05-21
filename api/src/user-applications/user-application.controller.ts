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

export class UserApplicationController {}
import { UserApplicationService } from './user-applications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user-applications')
export class UserApplicationsController {
  constructor(
    private readonly userapplicationService: UserApplicationService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body('userId') userId: number,
    @Body('applicationId') applicationId: Array<string>,
  ) {
    return this.userapplicationService.create(userId, applicationId);
  }

  @Post('get-user-applications')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getApplicationsByUserId(
    @Body() requestBody: { userId: number },
  ): Promise<{
    id?: number;
    userId?: number;
    application?: object;
  }> {
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

  @Post('delete-applications')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async deleteUserApplicationMapping(
    @Body() requestBody: { userId: number; applicationId: number },
  ): Promise<{ message: string; statusCode: number }> {
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
