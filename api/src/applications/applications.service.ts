import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Applications } from 'src/db/model/applications.model';
import { randomBytes } from 'crypto';
import { Optional } from 'sequelize';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Applications)
    private applicationsModel: typeof Applications,
  ) {}

  async getApplications(): Promise<Applications[]> {
    return this.applicationsModel.findAll({});
  }

  async createNewApplication(
    applicationData: Optional<any, string>,
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
      const clientSecretKey = randomBytes(32).toString('hex');
      const clientSecretId = randomBytes(16).toString('hex');
      applicationData.clientSecretKey = clientSecretKey;
      applicationData.clientSecretId = clientSecretId;

      await this.applicationsModel.create(applicationData);
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
    id: number,
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
