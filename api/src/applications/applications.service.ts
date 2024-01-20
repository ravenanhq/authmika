import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Applications } from 'src/db/model/applications.model';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Applications)
    private applicationsModel: typeof Applications,
  ) {}

  generateRandomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }
    return result;
  }

  async getApplications(): Promise<Applications[]> {
    return this.applicationsModel.findAll({});
  }

  async createNewApplication(
    applicationData,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const existingApplication = await this.applicationsModel.findOne({
        where: { application: applicationData.application },
      });
      if (existingApplication) {
        throw new HttpException(
          'Application name is already taken',
          HttpStatus.CONFLICT,
        );
      }
      const clientSecretKey = this.generateRandomString(32);
      const clientSecretId = this.generateRandomString(16);
      applicationData.clientSecretKey = clientSecretKey;
      applicationData.clientSecretId = clientSecretId;

      const result = await this.applicationsModel.create(applicationData);
      return {
        message: 'Application created successfully',
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

  async deleteApplication(
    id,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      await this.applicationsModel.destroy({
        where: {
          id: id,
        },
      });
      return {
        message: 'Application deleted successfully',
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      return {
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
