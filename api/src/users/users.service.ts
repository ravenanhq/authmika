import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Optional } from 'sequelize';
import { Users } from 'src/db/model/users.model';
import { UsersDto } from './dto/users.dto';
import { hash } from 'bcrypt';
import { UserApplications } from 'src/db/model/user-applications.model';
import { compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private userModel: typeof Users,
    @InjectModel(UserApplications)
    private userApplictionsModel: typeof UserApplications,
  ) {}

  async findUsername(userName: string): Promise<Users> {
    return this.userModel.findOne({
      where: {
        userName,
      },
    });
  }

  async getUsers(): Promise<Users[]> {
    try {
      const users = await this.userModel.findAll({
        where: { isActive: true },
      });
      return users;
    } catch (error) {
      throw new HttpException(
        'Error getting users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createNewUser(
    userData: Optional<any, string>,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const existingUser = await this.findUsername(userData.userName);
      if (existingUser) {
        throw new HttpException(
          'Username is already taken',
          HttpStatus.CONFLICT,
        );
      }
      await this.userModel.create(userData);
      return {
        message: 'User created successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        return {
          message: error.message,
          statusCode: HttpStatus.CONFLICT,
        };
      } else {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    }
  }

  async create(
    userDto: UsersDto,
    user: { id: any },
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { user_name, display_name, email, password, mobile, role } = userDto;
    try {
      const existingUser = await this.userModel.findOne({
        where: { userName: user_name },
      });
      if (existingUser) {
        throw new UnprocessableEntityException('User already exists.');
      } else {
        const newUser = await this.userModel.create({
          userName: user_name,
          displayName: display_name,
          email: email,
          password: await hash(password, 10),
          mobile: mobile,
          role: role,
          createdBy: user ? user.id : null,
        });

        if (!newUser) {
          throw new InternalServerErrorException('User creation failed');
        }
      }
      const users = await this.userModel.findAll({
        where: { isActive: true },
      });
      return {
        message: 'User created successfully',
        statusCode: HttpStatus.OK,
        data: users,
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

  async show(
    id: number,
  ): Promise<{ data: object; message: string; statusCode: number }> {
    try {
      const user = await this.userModel.findOne({
        where: {
          id,
        },
      });

      if (user) {
        return {
          data: user,
          message: 'User data found.',
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          data: [],
          message: 'User not found.',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      return {
        data: [],
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async update(
    userDto: UsersDto,
    user: { id: any },
    id: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { user_name, display_name, email, password, mobile, role } = userDto;
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });
      if (existingUser) {
        const fetchedUser = await this.userModel.findOne({
          where: { userName: user_name },
        });

        if (fetchedUser && fetchedUser.dataValues.id != id) {
          throw new UnprocessableEntityException('User already exists.');
        }

        existingUser.userName = user_name;
        existingUser.displayName = display_name;
        existingUser.email = email;
        existingUser.mobile = mobile;
        existingUser.password = password;
        existingUser.role = role;
        existingUser.updatedBy = user ? user.id : null;
        await existingUser.save();

        const users = await this.userModel.findAll({
          where: { isActive: true },
        });

        return {
          message: 'User updated successfully.',
          statusCode: HttpStatus.OK,
          data: users,
        };
      } else {
        return {
          message: 'User not found.',
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

  async updatePassword(
    userDto: UsersDto,
    user: { id: any; password: string | undefined },
    id: number,
    currentPassword: string,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { password } = userDto;
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: id },
      });
      if (existingUser) {
        const isPasswordMatch = await compare(
          currentPassword,
          existingUser.password,
        );
        if (!isPasswordMatch) {
          return {
            message: 'Current password is incorrect.',
            statusCode: 422,
            data: {},
          };
        }
        const hashedPassword = await hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.updatedBy = user ? user.id : null;
        await existingUser.save();

        const users = await this.userModel.findAll({
          where: { isActive: true },
        });

        return {
          message: 'Password updated successfully.',
          statusCode: HttpStatus.OK,
          data: users,
        };
      } else {
        return {
          message: 'User not found.',
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

  async deleteUser(
    id: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    try {
      const user = await Users.findOne({
        where: { id: id },
      });

      if (user) {
        const userApplication = await this.userApplictionsModel.findOne({
          where: {
            userId: id,
          },
        });

        if (userApplication) {
          const users = await this.userModel.findAll({
            where: { isActive: true },
          });

          return {
            message: 'The user cannot be deleted as a mapping exists.',
            statusCode: HttpStatus.OK,
            data: users,
          };
        } else {
          user.isActive = false;
          await user.save();

          const users = await this.userModel.findAll({
            where: { isActive: true },
          });

          return {
            message: 'User deleted successfully.',
            statusCode: HttpStatus.OK,
            data: users,
          };
        }
      } else {
        return {
          message: 'User not found.',
          statusCode: HttpStatus.NOT_FOUND,
          data: {},
        };
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      };
    }
  }
}
