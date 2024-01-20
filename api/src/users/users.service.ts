import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from 'src/db/model/users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users)
    private userModel: typeof Users,
  ) {}

  async findUsername(userName: string): Promise<Users> {
    return this.userModel.findOne({
      where: {
        userName,
      },
    });
  }

  async getUsers(): Promise<Users[]> {
    return this.userModel.findAll({});
  }

  async createNewUser(
    userData,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const existingUser = await this.findUsername(userData.userName);
      if (existingUser) {
        throw new HttpException(
          'Username is already taken',
          HttpStatus.CONFLICT,
        );
      }
      const result = await this.userModel.create(userData);
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

  async deleteUser(id): Promise<{ message: string; statusCode: number }> {
    const isUserAvailable = await Users.findOne({
      where: { id: id },
    });
    if (isUserAvailable) {
      try {
        await this.userModel.destroy({
          where: {
            id: id,
          },
        });
        return {
          message: 'User deleted successfully',
          statusCode: HttpStatus.OK,
        };
      } catch (error) {
        return {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
      }
    } else {
      return {
        message: 'User not found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }
}
