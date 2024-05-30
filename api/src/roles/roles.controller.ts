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
import { RolesDto } from './dto/roles.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

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
    @Body() rolesDto: RolesDto,
    @Request() req,
  ): Promise<{ message: string; statusCode: number }> {
    return this.roleService.create(rolesDto, req.user);
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
    @Body() rolesDto: RolesDto,
    @Request() req,
    @Param('id') id: number,
  ): Promise<{ message: string; statusCode: number }> {
    return this.roleService.update(rolesDto, req.user, id);
  }

  @Get('get-active-roles')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  async getActiveRoles() {
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
