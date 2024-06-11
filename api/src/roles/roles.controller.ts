import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  ValidationPipe,
  Post,
  Request,
  UsePipes,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import {
  RolesCreateSuccessDto,
  RolesDataDto,
  RolesDeleteSuccessDto,
  RolesDto,
  RolesUpdateSuccessDto,
} from './dto/roles.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiTags('Roles')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    isArray: true,
    type: RolesDataDto,
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
  @ApiOperation({ summary: 'Get all available roles' })
  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getRoles() {
    try {
      const activeRoles = await this.roleService.getRoleList();
      return activeRoles;
    } catch (error) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiTags('Roles')
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Success',
    type: RolesCreateSuccessDto,
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
  @ApiOperation({ summary: 'Create a new role' })
  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() rolesDto: RolesDto,
    @Request() req,
  ): Promise<{ message: string; statusCode: number }> {
    return this.roleService.create(rolesDto, req.user);
  }

  @ApiTags('Roles')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: RolesDeleteSuccessDto,
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
  @ApiOperation({ summary: 'Delete a role' })
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: number): Promise<RolesDeleteSuccessDto> {
    return this.roleService.delete(id);
  }

  @ApiTags('Roles')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: RolesUpdateSuccessDto,
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
  @ApiOperation({ summary: 'Update a role' })
  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() rolesDto: RolesDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<RolesUpdateSuccessDto> {
    return this.roleService.update(rolesDto, req.user, id);
  }
}
