import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { prompt } from 'enquirer';
import { ApplicationsService } from './applications.service';
import { Applications } from 'src/db/model/applications.model';

interface IUserInput {
  name: string;
  application: string;
  baseUrl: string;
}

@Injectable()
export class ApplicationsCommand {
  constructor(private readonly applicationService: ApplicationsService) {}

  @Command({
    command: 'application:list',
    describe: 'Lists all applications',
  })
  async listApplications() {
    try {
      let get: string;
      let userId: number;
      const applicaitons = await this.applicationService.getApplications(
        get,
        userId,
      );

      if (applicaitons.length > 0) {
        const applicationList = [];
        applicaitons.forEach((application) => {
          applicationList.push({
            id: application.dataValues.id,
            name: application.dataValues.name,
            application: application.dataValues.application,
            base_url: application.dataValues.baseUrl,
            client_secret_id: application.dataValues.clientSecretId,
            client_secret_key: application.dataValues.clientSecretKey,
            is_active: application.dataValues.isActive ? 'Yes' : 'No',
          });
        });
        console.table(applicationList, [
          'id',
          'name',
          'application',
          'base_url',
          'client_secret_id',
          'client_secret_key',
          'is_active',
        ]);
      } else {
        console.log('No applications found.');
      }
    } catch (error) {
      console.error(error.message);
    }
  }

  @Command({
    command: 'application:create',
    describe: 'Create a new application',
  })
  async createApplication() {
    await prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name:',
        validate: (input) => {
          if (!input) {
            return 'Name is required';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'application',
        message: 'Enter the application name:',
        validate: (input) => {
          if (!input) {
            return 'Application name is required';
          }
          if (!/^[a-z_]+$/.test(input)) {
            return 'Application name must contain only lowercase letters and underscores';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'baseUrl',
        message: 'Enter the base url:',
        validate: (input) => {
          if (!input) {
            return 'Base url is required';
          }
          const pattern =
            /^(https?:\/\/www\.|http?:\/\/www\.|https?:\/\/|http?:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?\/[a-zA-Z0-9]{2,}$/;
          if (pattern.test(input)) {
            return 'Invalid URL format. Example: https://example.com';
          }
          return true;
        },
      },
    ]).then(async (userInput: IUserInput) => {
      const applicationData = {
        name: userInput.name,
        application: userInput.application,
        baseUrl: userInput.baseUrl,
      };
      const result =
        await this.applicationService.createNewApplication(applicationData);

      if (result.statusCode == 200) {
        console.log(result.message);
      } else {
        console.log(result.message);
      }
    });
  }

  @Command({
    command: 'application:delete <applicationId>',
    describe: 'Delete a user with id',
  })
  async deleteUser(
    @Positional({
      name: 'applicationId',
      describe: 'The application id to delete',
      type: 'number',
    })
    applicationId: number,
  ) {
    const isApplicationAvailable = await Applications.findOne({
      where: {
        id: applicationId,
      },
    });
    if (isApplicationAvailable) {
      const result =
        await this.applicationService.deleteApplication(applicationId);

      if (result.statusCode == 200) {
        console.log(result.message);
      } else {
        console.log(result.message);
      }
    } else {
      console.error('Application not found');
    }
  }
}
