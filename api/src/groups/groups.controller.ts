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
import {
  GroupCreateSuccessDto,
  GroupDeleteSuccessDto,
  GroupsData,
  GroupsDto,
  GroupUpdateSuccessDto,
} from './dto/groups.dto';
import { GroupsService } from './groups.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('groups')
export class GroupsController {
  constructor(private groupService: GroupsService) {}

  @ApiTags('Groups')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GroupsData,
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
  @ApiOperation({ summary: 'Get all groups' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getGroups() {
    try {
      const activeGroups = await this.groupService.getGroupList();
      return activeGroups;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiTags('Groups')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: GroupCreateSuccessDto,
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
    status: 409,
    description: 'Conflict',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Create a new group' })
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() groupsDto: GroupsDto,
    @Request() req,
  ): Promise<GroupCreateSuccessDto> {
    return this.groupService.create(groupsDto, req.user);
  }

  @ApiTags('Groups')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GroupDeleteSuccessDto,
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
  @ApiOperation({ summary: 'Delete a group' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number): Promise<GroupDeleteSuccessDto> {
    return this.groupService.delete(id);
  }

  @ApiTags('Groups')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: GroupUpdateSuccessDto,
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
    status: 409,
    description: 'Conflict',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Update a group' })
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() groupsDto: GroupsDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<GroupUpdateSuccessDto> {
    return this.groupService.update(groupsDto, req.user, id);
  }
}
