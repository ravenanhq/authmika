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
import { ApplicationsDto } from './dto/applications.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('applications')
export class ApplicationsController {
  constructor(private applicationService: ApplicationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getApplications() {
    return this.applicationService.getApplications();
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() applicationsDto: ApplicationsDto,
    @Request() req,
  ): Promise<{ message: string; statusCode: number }> {
    return this.applicationService.create(applicationsDto, req.user);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async show(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.applicationService.show(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() applicationsDto: ApplicationsDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.applicationService.update(applicationsDto, req.user, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.applicationService.deleteApplication(id);
  }

  @Get('get/:clientId')
  @UseGuards(AuthGuard('jwt'))
  getApplicationId(@Param('clientId') clientId: number) {
    return this.applicationService.getApplication(clientId);
  }
}
