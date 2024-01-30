import { Command, Positional, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { prompt } from 'inquirer';
import * as ora from 'ora';
import { ApplicationsService } from './applications.service';
import { Applications } from 'src/db/model/applications.model';

@Injectable()
export class ApplicationsCommand {
  constructor(private readonly applicationService: ApplicationsService) {}
  spinner = ora();
  @Command({
    command: 'application:list',
    describe: 'Lists all applications',
  })
  async listApplications() {
    this.spinner.start();
    try {
      const applicaitons = await this.applicationService
        .getApplications()
        .finally(() => {
          this.spinner.stop();
        });

      if (applicaitons.length > 0) {
        var Table = require('cli-table3');
        let table = new Table({
          head: [
            'id',
            'name',
            'application',
            'base_url',
            'client_secret_id',
            'client_secret_key',
            'is_active',
          ],
          style: {
            head: [],
          },
        });

        applicaitons.forEach((application) => {
          table.push([
            application.dataValues.id,
            application.dataValues.name,
            application.dataValues.application,
            application.dataValues.baseUrl,
            application.dataValues.clientSecretId,
            application.dataValues.clientSecretKey,
            application.dataValues.isActive ? 'Yes' : 'No',
          ]);
        });
      } else {
        this.spinner.fail('No applications found.');
      }
    } catch (error) {
      this.spinner.fail(error.message);
    }
  }

  @Command({
    command: 'application:create',
    describe: 'Create a new application',
  })
  async createApplication() {
    const userInput = await prompt([
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
    ]);
    this.spinner.start();

    const applicationData = {
      name: userInput.name,
      application: userInput.application,
      baseUrl: userInput.baseUrl,
    };
    const result =
      await this.applicationService.createNewApplication(applicationData);

    if (result.statusCode == 200) {
      this.spinner.succeed(result.message);
    } else {
      this.spinner.fail(result.message);
    }
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
    applicationId: Number,
  ) {
    this.spinner.start();
    const isApplicationAvailable = await Applications.findOne({
      where: {
        id: applicationId,
      },
    });
    if (isApplicationAvailable) {
      const result =
        await this.applicationService.deleteApplication(applicationId);

      if (result.statusCode == 200) {
        this.spinner.succeed(result.message);
      } else {
        this.spinner.fail(result.message);
      }
    } else {
      this.spinner.fail('Application not found');
    }
  }
}
