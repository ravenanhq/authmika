import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Applications } from 'src/db/model/applications.model';
import { randomBytes } from 'crypto';
import { Optional } from 'sequelize';
import {
  ApplicationCreateDataDto,
  ApplicationDeleteSuccessDto,
  ApplicationGetSuccessDto,
  ApplicationsDto,
  ApplicationUpdateSuccessDto,
} from './dto/applications.dto';
import { UserApplications } from 'src/db/model/user-applications.model';
import { AuthClients } from 'src/db/model/auth-clients.model';
import * as fs from 'fs';
import * as path from 'path';
import { Users } from 'src/db/model/users.model';
import { GroupUsers } from 'src/db/model/group-users.model';
import { Groups } from 'src/db/model/groups.model';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectModel(UserApplications)
    private userApplictionsModel: typeof UserApplications,
    @InjectModel(Applications)
    private applicationsModel: typeof Applications,
    @InjectModel(Users)
    private usersModel: typeof Users,
    @InjectModel(GroupUsers)
    private groupUsersModel: typeof GroupUsers,
    @InjectModel(Groups)
    private groupModel: typeof Groups,
  ) {}

  async getApplications(get: string, userId?: number) {
    const GET_ALL = 'all';
    const GET_FILTER = 'filter';
    if (get === GET_ALL) {
      const applications = await this.applicationsModel.findAll({
        where: { isActive: true },
      });
      if (applications && applications.length == 0) {
        throw new NotFoundException('No applications found');
      }
      return applications;
    } else if (get === GET_FILTER) {
      const whereCondition: any = {};
      if (userId) {
        if (userId !== undefined) {
          whereCondition.userId = userId;
        }
        const userApplications = await this.userApplictionsModel.findAll({
          where: whereCondition,
        });
        const applications: any = [];
        for (const userApp of userApplications) {
          const applicationId = userApp.applicationId;
          const applicationDetails = await this.applicationsModel.findOne({
            where: {
              id: applicationId,
            },
          });
          if (applicationDetails) {
            applications.push(applicationDetails);
          }
        }
        return applications;
      }
    }
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
    applicationDto: ApplicationCreateDataDto,
    user: { id: any },
    isAdd: string | boolean,
    userId: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const isAddBool =
      typeof isAdd === 'string' ? JSON.parse(isAdd.toLowerCase()) : isAdd;

    const { name, application, base_url, call_back_url, logo_path, file } =
      applicationDto;
    let newApplication;
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
        throw new HttpException(
          {
            message: 'aplication already exists',
            statusCode: HttpStatus.CONFLICT,
            data: null,
          },
          HttpStatus.CONFLICT,
        );
      } else {
        newApplication = await this.applicationsModel.create({
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
          throw new InternalServerErrorException(
            'Application creation failed.',
          );
        }
      }
      if (isAddBool) {
        const applications = await this.applicationsModel.findAll({
          where: { isActive: true },
        });

        return {
          message: 'Application created successfully.',
          statusCode: HttpStatus.OK,
          data: applications,
        };
      } else if (userId) {
        await this.userApplictionsModel.create({
          userId: userId,
          applicationId: newApplication.id,
        });
      }
      const userApplications = await this.userApplictionsModel.findAll({
        where: { userId: userId },
      });
      if (!userApplications || userApplications.length === 0) {
        throw new NotFoundException(
          'No applications found for this application',
        );
      }

      const applicationIds = userApplications.map(
        (userApplication) => userApplication.applicationId,
      );

      const applications = await this.applicationsModel.findAll({
        where: {
          id: applicationIds,
          isActive: true,
        },
      });

      return {
        message: 'Application created successfully',
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

  async show(id: number): Promise<ApplicationGetSuccessDto> {
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
        throw new HttpException(
          {
            data: null,
            message: 'Application not found.',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          data: null,
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    applicationDto: ApplicationsDto,
    user: { id: any },
    id: number,
  ): Promise<ApplicationUpdateSuccessDto> {
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
        } else {
          fileName = logo_path;
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

        return {
          message: 'Application updated successfully.',
          statusCode: HttpStatus.OK,
          data: existingApplication,
        };
      } else {
        throw new HttpException(
          {
            data: null,
            message: 'Application not found.',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          {
            data: null,
            message: error.message,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async deleteApplication(id: number): Promise<ApplicationDeleteSuccessDto> {
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
          return {
            message: 'The application cannot be deleted as a mapping exists.',
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
            data: [],
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
        throw new HttpException(
          {
            data: null,
            message: 'Application not found.',
            statusCode: HttpStatus.NOT_FOUND,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
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

        if (!clientModel) {
          throw new NotFoundException({
            message: 'clientId not found.',
            statusCode: HttpStatus.NOT_FOUND,
          });
        }

        const application = await Applications.findOne({
          where: {
            clientSecretId: clientModel.clientSecretId,
            clientSecretKey: clientModel.clientSecretKey,
          },
        });

        if (!application) {
          throw new NotFoundException('Application not found.');
        }
        return {
          message: 'Success',
          statusCode: HttpStatus.OK,
          applicationId: application.id,
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          applicationId: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getUsersAndGroupsByApplicationId(id: number) {
    const application = await this.applicationsModel.findOne({
      where: { id: id },
    });
    if (!application) {
      throw new NotFoundException('Application not found');
    }

    const userApplications = await this.userApplictionsModel.findAll({
      where: { applicationId: id },
    });

    if (!userApplications || userApplications.length === 0) {
      throw new NotFoundException('No users found for this application');
    }

    const userIds = userApplications.map(
      (userApplication) => userApplication.userId,
    );

    const users = await this.usersModel.findAll({
      where: {
        id: userIds,
      },
      attributes: ['id', 'firstName', 'lastName'],
    });

    const groupIds = await this.groupUsersModel.findAll({
      where: { userId: userIds },
      attributes: ['groupId'],
    });
    const uniqueGroupIds = Array.from(
      new Set(groupIds.map((item) => item.groupId)),
    );

    const groups = await this.groupModel.findAll({
      where: { id: uniqueGroupIds },
    });

    return { users, groups };
  }
}
