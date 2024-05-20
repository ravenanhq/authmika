import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Applications } from 'src/db/model/applications.model';
import { randomBytes } from 'crypto';
import { Optional } from 'sequelize';
import { ApplicationsDto } from './dto/applications.dto';
import { UserApplications } from 'src/db/model/user-applications.model';
import { AuthClients } from 'src/db/model/auth-clients.model';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(UserApplications)
    private userApplictionsModel: typeof UserApplications,
    @InjectModel(Applications)
    private applicationsModel: typeof Applications,
  ) {}

  async getApplications() {
    return this.applicationsModel.findAll({
      where: { isActive: true },
    });
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
    const { name, application, base_url, call_back_url, logo_path, file } =
      applicationDto;
    try {
      let fileName = null;
      if (file) {
        fileName = `${Date.now()}_` + logo_path;
        const targetPath = path.join(
          __dirname,
          '../../..',
          'api/public/assets/images',
          fileName,
        );
        const base64Image = file.split(';base64,').pop();

        fs.writeFile(targetPath, base64Image, { encoding: 'base64' }, (err) => {
          if (err) {
            console.error('Error saving image:', err);
          }
        });
      }

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
          callBackUrl: call_back_url,
          logoPath: fileName,
          clientSecretId: clientSecretId,
          clientSecretKey: clientSecretKey,
          createdBy: user ? user.id : null,
        });

        if (!newApplication) {
          throw new InternalServerErrorException('User creation failed.');
        }
      }

      const applications = await this.applicationsModel.findAll({
        where: { isActive: true },
      });

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
    const { name, application, base_url, call_back_url, logo_path, file } =
      applicationDto;
    try {
      const existingApplication = await this.applicationsModel.findOne({
        where: { id: id },
      });
      if (existingApplication) {
        let fileName = null;
        if (file) {
          if (existingApplication.logoPath) {
            const absolutePath = path.resolve(
              __dirname,
              '../../..',
              'api/public/assets/images',
              existingApplication.logoPath,
            );

            await fs.promises.unlink(absolutePath);
          }
          fileName = `${Date.now()}_` + logo_path;
          const targetPath = path.join(
            __dirname,
            '../../..',
            'api/public/assets/images',
            fileName,
          );
          const base64Image = file.split(';base64,').pop();

          fs.writeFile(
            targetPath,
            base64Image,
            { encoding: 'base64' },
            (err) => {
              if (err) {
                console.error('Error saving image:', err);
              }
            },
          );
        }
        const fetchedApplication = await this.applicationsModel.findOne({
          where: { application: application },
        });

        if (fetchedApplication && fetchedApplication.dataValues.id != id) {
          throw new UnprocessableEntityException('application already exists.');
        }

        existingApplication.name = name;
        existingApplication.application = application;
        existingApplication.baseUrl = base_url;
        existingApplication.callBackUrl = call_back_url;
        existingApplication.logoPath = fileName;
        existingApplication.updatedBy = user ? user.id : null;
        await existingApplication.save();

        const applications = await this.applicationsModel.findAll({
          where: { isActive: true },
        });

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
  ): Promise<{ message: string; statusCode: number; data: object }> {
    try {
      const application = await this.applicationsModel.findOne({
        where: {
          id,
          isActive: true,
        },
      });

      if (application) {
        const userApplication = await this.userApplictionsModel.findOne({
          where: {
            applicationId: id,
          },
        });

        if (userApplication) {
          const applications = await this.applicationsModel.findAll({
            where: { isActive: true },
          });

          return {
            message: 'The application cannot be deleted as a mapping exists.',
            statusCode: HttpStatus.OK,
            data: applications,
          };
        } else {
          application.isActive = false;
          await application.save();

          const applications = await this.applicationsModel.findAll({
            where: { isActive: true },
          });

          return {
            message: 'Application deleted successfully.',
            statusCode: HttpStatus.OK,
            data: applications,
          };
        }
      } else {
        return {
          message: 'Application not found.',
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

  async getApplication(clientId: number): Promise<{
    message: string;
    statusCode: number;
    applicationId: number | null;
  }> {
    try {
      if (clientId) {
        const clientModel = await AuthClients.findOne({
          where: { id: clientId },
        });

        const application = await Applications.findOne({
          where: {
            clientSecretId: clientModel.clientSecretId,
            clientSecretKey: clientModel.clientSecretKey,
          },
        });

        if (!application) {
          throw new UnauthorizedException('Application not found.');
        }
        return {
          message: 'Success',
          statusCode: HttpStatus.OK,
          applicationId: application.id,
        };
      }
    } catch (error) {
      return {
        message: error.message,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        applicationId: null,
      };
    }
  }
}
