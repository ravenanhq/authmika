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
  UseGuards,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import {
  ApplicationsDataDto,
  ApplicationsDto,
  ApplicationCreateSuccessDto,
  ApplicationCreateDataDto,
  ApplicationGetSuccessDto,
  ApplicationUpdateSuccessDto,
  ApplicationDeleteSuccessDto,
  GetApplicationIdSuccessDto,
} from './dto/applications.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationService: ApplicationsService) {}

  @ApiTags('Applications')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ApplicationsDataDto,
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
  @ApiOperation({ summary: 'Get all active applications' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getApplications() {
    return this.applicationService.getApplications();
  }

  @ApiTags('Applications')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ApplicationsDataDto,
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
  @ApiOperation({ summary: 'Create a application' })
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() applicationsDto: ApplicationCreateDataDto,
    @Request() req,
  ): Promise<{ message: string; statusCode: number }> {
    return this.applicationService.create(applicationsDto, req.user);
  }

  @ApiTags('Applications')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ApplicationGetSuccessDto,
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
  @ApiOperation({ summary: 'Get a application by id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async show(@Param('id') id: number): Promise<ApplicationGetSuccessDto> {
    return this.applicationService.show(id);
  }

  @ApiTags('Applications')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ApplicationGetSuccessDto,
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
  @ApiOperation({ summary: 'Update a application by id' })
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() applicationsDto: ApplicationsDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<ApplicationUpdateSuccessDto> {
    return this.applicationService.update(applicationsDto, req.user, id);
  }

  @ApiTags('Applications')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ApplicationDeleteSuccessDto,
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
  @ApiOperation({ summary: 'Delete a application by id' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number): Promise<ApplicationDeleteSuccessDto> {
    return this.applicationService.deleteApplication(id);
  }

  @ApiTags('Applications')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GetApplicationIdSuccessDto,
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
  @ApiOperation({ summary: 'Get a application id by client Id' })
  @Get('get/:clientId')
  @UseGuards(AuthGuard('jwt'))
  getApplicationId(@Param('clientId') clientId: number) {
    return this.applicationService.getApplication(clientId);
  }
}
