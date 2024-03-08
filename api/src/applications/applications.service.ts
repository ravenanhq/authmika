import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Applications } from 'src/db/model/applications.model';
import { randomBytes } from 'crypto';
import { Optional } from 'sequelize';
import { ApplicationsDto } from './dto/applications.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(Applications)
    private applicationsModel: typeof Applications,
  ) {}

  async getApplications() {
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
        message: 'Application created successfully.',
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
    applicationDto: ApplicationsDto,
    user: { id: any },
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { name, application, base_url } = applicationDto;
    try {
      const clientSecretKey = randomBytes(32).toString('hex');
      const clientSecretId = randomBytes(16).toString('hex');

      const existingApplication = await this.applicationsModel.findOne({
        where: { application: application },
      });
      if (existingApplication) {
        throw new UnprocessableEntityException('application already exists.');
      } else {
        const newApplication = await this.applicationsModel.create({
          name: name,
          application: application,
          baseUrl: base_url,
          clientSecretId: clientSecretId,
          clientSecretKey: clientSecretKey,
          createdBy: user ? user.id : null,
        });

        if (!newApplication) {
          throw new InternalServerErrorException('User creation failed.');
        }
      }

      const applications = await this.applicationsModel.findAll({});

      return {
        message: 'Application created successfully.',
        statusCode: HttpStatus.OK,
        data: applications,
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
      const application = await this.applicationsModel.findOne({
        where: {
          id,
        },
      });

      if (application) {
        return {
          data: application,
          message: 'Application data found.',
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          data: [],
          message: 'Application not found.',
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
    applicationDto: ApplicationsDto,
    user: { id: any },
    id: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { name, application, base_url } = applicationDto;
    try {
      const existingApplication = await this.applicationsModel.findOne({
        where: { id: id },
      });
      if (existingApplication) {
        const fetchedApplication = await this.applicationsModel.findOne({
          where: { application: application },
        });

        if (fetchedApplication && fetchedApplication.dataValues.id != id) {
          throw new UnprocessableEntityException('application already exists.');
        }

        existingApplication.name = name;
        existingApplication.application = application;
        existingApplication.baseUrl = base_url;
        existingApplication.updatedBy = user ? user.id : null;
        await existingApplication.save();

        const applications = await this.applicationsModel.findAll({});

        return {
          message: 'Application updated successfully.',
          statusCode: HttpStatus.OK,
          data: applications,
        };
      } else {
        return {
          message: 'Application not found.',
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

  async deleteApplication(
    id: number,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const application = await this.applicationsModel.findOne({
        where: {
          id,
        },
      });

      if (application) {
        await this.applicationsModel.destroy({
          where: {
            id: id,
          },
        });

        return {
          message: 'Application deleted successfully.',
          statusCode: HttpStatus.OK,
        };
      } else {
        return {
          message: 'Application not found.',
          statusCode: HttpStatus.NOT_FOUND,
        };
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
