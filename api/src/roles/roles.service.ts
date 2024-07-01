import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Roles } from 'src/db/model/roles.model';
import {
  RolesCreateSuccessDto,
  RolesDataDto,
  RolesDeleteSuccessDto,
  RolesDto,
  RolesInUserUpdateSuccessDto,
  RolesUpdateSuccessDto,
  UsersDataDto,
} from './dto/roles.dto';
import { Op } from 'sequelize';
import { Users } from 'src/db/model/users.model';

@Injectable()
export class RolesService {
  constructor(
    @InjectModel(Roles)
    private rolesModel: typeof Roles,
    @InjectModel(Users)
    private userModel: typeof Users,
  ) {}

  async getRoleList(): Promise<RolesDataDto[]> {
    try {
      const role = await this.rolesModel.findAll({ where: { status: 1 } });
      return role;
    } catch (error) {
      throw new HttpException(
        'Error getting role',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    rolesDto: RolesDto,
    user: { userId: any },
  ): Promise<RolesCreateSuccessDto> {
    const { name } = rolesDto;
    try {
      const existingUserRole = await this.rolesModel.findOne({
        where: { name: name },
      });

      if (existingUserRole) {
        throw new NotFoundException('Role already exists.');
      } else {
        const newRole = await this.rolesModel.create({
          name: name,
          createdBy: user.userId,
        });
        if (!newRole) {
          throw new InternalServerErrorException('Role creation failed');
        }
      }
      const roles = await this.rolesModel.findAll({
        where: { status: 1 },
      });
      return {
        message: 'Role created successfully',
        statusCode: HttpStatus.CREATED,
        data: roles,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.CONFLICT,
            data: null,
          },
          HttpStatus.CONFLICT,
        );
        // return {
        //   message: error.message,
        //   statusCode: HttpStatus.CONFLICT,
        //   data: null,
        // };
      } else {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            data: null,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async update(
    rolesDto: RolesDto,
    user: { userId: any },
    id: number,
  ): Promise<RolesUpdateSuccessDto> {
    const { name } = rolesDto;
    try {
      const existingRole = await this.rolesModel.findOne({
        where: { id: id },
      });
      if (existingRole) {
        const existingUserRole = await this.rolesModel.findOne({
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

        return {
          message: 'Role updated successfully.',
          statusCode: HttpStatus.OK,
          data: {
            users: [],
          },
        };
      } else {
        throw new HttpException(
          {
            message: 'Role not found.',
            statusCode: HttpStatus.NOT_FOUND,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.CONFLICT,
            data: null,
          },
          HttpStatus.CONFLICT,
        );
      } else {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            data: null,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async delete(id: number): Promise<RolesDeleteSuccessDto> {
    try {
      const role = await this.rolesModel.findOne({
        where: {
          id: id,
        },
      });
      if (role) {
        const userRole = await this.userModel.findOne({
          where: {
            role: role.name,
          },
        });
        if (userRole) {
          return {
            message: 'The role cannot be deleted as a mapping exists.',
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            data: [],
          };
        } else {
          role.status = 0;
          await role.save();

          const roles = await this.rolesModel.findAll({
            where: { status: 1 },
          });

          return {
            message: 'Role deleted successfully.',
            statusCode: HttpStatus.OK,
            data: roles,
          };
        }
      } else {
        throw new HttpException(
          {
            message: 'Role not found.',
            statusCode: HttpStatus.NOT_FOUND,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          message: 'An error occurred while deleting the role.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getUserList(id: number): Promise<RolesInUserUpdateSuccessDto> {
    try {
      const existingRole = await this.rolesModel.findOne({
        where: { id },
      });

      if (!existingRole) {
        throw new HttpException('Role not found.', HttpStatus.NOT_FOUND);
      }

      const usersWithRole = await this.userModel.findAll({
        where: { role: existingRole.name, status: { [Op.not]: [0] } },
      });

      const responseData: UsersDataDto[] = usersWithRole.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        status: user.status,
        createdAt: user.created_at,
      }));

      return {
        message: 'Users fetched successfully.',
        statusCode: HttpStatus.OK,
        data: {
          users: responseData,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
