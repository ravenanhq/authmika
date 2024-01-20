import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserApplications } from 'src/db/model/user-applications.model';

@Injectable()
export class UserApplicationService {
  constructor(
    @InjectModel(UserApplications)
    private userApplictionsModel: typeof UserApplications,
  ) {}

  async getAllUserApplications(): Promise<UserApplications[]> {
    return this.userApplictionsModel.findAll({});
  }

  async linkUserToApplication(
    userId,
    applicationId,
  ): Promise<{
    message: string;
    statusCode: number;
  }> {
    try {
      const existingLink = await this.userApplictionsModel.findOne({
        where: { userId: userId, applicationId: applicationId },
      });
      if (existingLink) {
        throw new HttpException(
          'User and application already mapped',
          HttpStatus.CONFLICT,
        );
      }
      const result = await this.userApplictionsModel.create({
        userId: userId,
        applicationId: applicationId,
      });
      return {
        message: 'User and application mapped successfully',
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

  async deleteMapping(id): Promise<{ message: string; statusCode: number }> {
    const isMapAvailable = await this.userApplictionsModel.findOne({
      where: {
        id: id,
      },
    });
    if (isMapAvailable) {
      try {
        await this.userApplictionsModel.destroy({
          where: {
            id: id,
          },
        });
        return {
          message: 'Mapping deleted successfully',
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
        message: 'No mapping found',
        statusCode: HttpStatus.NOT_FOUND,
      };
    }
  }
}
