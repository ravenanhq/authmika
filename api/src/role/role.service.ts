import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from 'src/db/model/role.model';
import { RoleDto } from './dto/role.dto';
import { Op } from 'sequelize';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {}

  async getRoleList(): Promise<Role[]> {
    try {
      const role = await this.roleModel.findAll({ where: { status: 1 } });
      return role;
    } catch (error) {
      throw new HttpException(
        'Error getting role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    roleDto: RoleDto,
    user: { userId: any },
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { name } = roleDto;
    try {
      const existingUserRole = await this.roleModel.findOne({
        where: { name: name },
      });

      if (existingUserRole) {
        throw new NotFoundException('Role already exists.');
      } else {
        const newRole = await this.roleModel.create({
          name: name,
          createdBy: user.userId,
        });
        if (!newRole) {
          throw new InternalServerErrorException('Role creation failed');
        }
      }
      const roles = await this.roleModel.findAll({
        where: { status: 1 },
      });
      return {
        message: 'Role created successfully',
        statusCode: HttpStatus.OK,
        data: { roles },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
          data: {},
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {},
        };
      }
    }
  }

  async update(
    roleDto: RoleDto,
    user: { userId: any },
    id: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { name } = roleDto;
    try {
      const existingRole = await this.roleModel.findOne({
        where: { id: id },
      });
      if (existingRole) {
        const existingUserRole = await this.roleModel.findOne({
          where: { name: name },
        });
        if (
          existingUserRole &&
          existingUserRole.id.toString() !== id.toString()
        ) {
          throw new UnprocessableEntityException('Name already exists.');
        }
        existingRole.name = name;
        existingRole.updatedBy = user.userId;
        await existingRole.save();

        const roles = await this.roleModel.findAll({
          where: { status: { [Op.or]: [1, 2] } },
        });

        return {
          message: 'Role updated successfully.',
          statusCode: HttpStatus.OK,
          data: roles,
        };
      } else {
        return {
          message: 'Role not found.',
          statusCode: HttpStatus.NOT_FOUND,
          data: {},
        };
      }
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
          data: {},
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: {},
        };
      }
    }
  }

  async delete(
    id: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    try {
      const role = await this.roleModel.findOne({
        where: {
          id,
          status: true,
        },
      });

      if (role) {
        role.status = false;
        await role.save();

        const roles = await this.roleModel.findAll({
          where: { status: true },
        });

        return {
          message: 'Role deleted successfully.',
          statusCode: HttpStatus.OK,
          data: roles,
        };
      } else {
        return {
          message: 'Role not found.',
          statusCode: HttpStatus.NOT_FOUND,
          data: {},
        };
      }
    } catch (error) {
      return {
        message: 'An error occurred while deleting the role.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      };
    }
  }

  async getActiveRoles(): Promise<Role[]> {
    try {
      const roles = await this.getRoleList();
      return roles;
    } catch (error) {
      throw new HttpException(
        'Error assigning roles to users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
