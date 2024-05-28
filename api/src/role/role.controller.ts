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
import { RoleService } from './role.service';
import { RoleDto } from './dto/role.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('role')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getRoles() {
    try {
      const activeRoles = await this.roleService.getRoleList();
      return activeRoles;
    } catch (error) {
      console.error('Error fetching active role:', error);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Body() roleDto: RoleDto,
    @Request() req,
  ): Promise<{ message: string; statusCode: number }> {
    return this.roleService.create(roleDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.roleService.delete(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Body() roleDto: RoleDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.roleService.update(roleDto, req.user, id);
  }

  @Get('get-active-roles')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async activeRoles() {
    try {
      const activeRoles = await this.roleService.getRoleList();
      return activeRoles;
    } catch (error) {
      throw new HttpException(
        'Error assigning roles to users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
