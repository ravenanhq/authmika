import {
  Body,
  Controller,
  HttpStatus,
  ValidationPipe,
  UsePipes,
  HttpCode,
  Post,
  HttpException,
  Get,
  Param,
  Delete,
  Request,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GroupsDto } from './dto/groups.dto';
import { GroupsService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('groups')
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getUsers() {
    try {
      const activeGroups = await this.groupService.getGroupList();
      return activeGroups;
    } catch (error) {
      console.error('Error fetching active groups:', error);
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
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() groupsDto: GroupsDto,
    @Request() req,
  ): Promise<{ message: string; statusCode: number }> {
    return this.groupService.create(groupsDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.groupService.delete(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() groupsDto: GroupsDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.groupService.update(groupsDto, req.user, id);
  }
}
