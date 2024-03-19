import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserApplications } from 'src/db/model/user-applications.model';
import { Applications } from 'src/db/model/applications.model';

interface MyArray<T> extends Array<T> {}

@Injectable()
export class UserApplicationService {
  constructor(
    @InjectModel(UserApplications)
    private userApplictionsModel: typeof UserApplications,
    @InjectModel(Applications)
    private readonly applictionsModel: typeof Applications,
  ) {}

  async getAllUserApplications(): Promise<UserApplications[]> {
    return this.userApplictionsModel.findAll({});
  }

  async getApplicationsByUserId(userId?: number): Promise<{
    id: number;
    userId: number;
    application: object;
  }> {
    try {
      const whereCondition: any = {};
      if (userId !== undefined) {
        whereCondition.userId = userId;
      }

      const userApplications = await this.userApplictionsModel.findAll({
        where: whereCondition,
      });
      const detailedUserApplications: any = [];
      for (const userApp of userApplications) {
        const applicationId = userApp.applicationId;
        const applicationDetails = await this.applictionsModel.findOne({
          where: {
            id: applicationId,
          },
        });

        if (applicationDetails) {
          const detailedUserApp = {
            id: userApp.id,
            userId: userApp.userId,
            application: applicationDetails,
          };

          detailedUserApplications.push(detailedUserApp);
        }
      }
      return detailedUserApplications;
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }
  }

  async create(userId: number, applicationId: MyArray<string>) {
    if (userId == undefined || userId == null) {
      return {
        message: 'User Id not supplied.',
        statusCode: HttpStatus.OK,
      };
    }

    if (applicationId == undefined || applicationId.length == 0) {
      return {
        message: 'Application Id not supplied.',
        statusCode: HttpStatus.OK,
      };
    }

    await this.userApplictionsModel.destroy({
      where: {
        userId: userId,
      },
    });

    applicationId.forEach(async (item) => {
      await this.userApplictionsModel.create({
        userId: userId,
        applicationId: item,
      });
    });

    return {
      message: 'User and application mapped successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async linkUserToApplication(
    userId: number,
    applicationId: number,
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
      await this.userApplictionsModel.create({
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

  async deleteMapping(
    id: number,
  ): Promise<{ message: string; statusCode: number }> {
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
