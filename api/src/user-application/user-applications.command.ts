import { UserApplicationService } from './user-applications.service';
import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { prompt } from 'inquirer';
import * as ora from 'ora';
import { Users } from 'src/db/model/users.model';
import { Applications } from 'src/db/model/applications.model';

@Injectable()
export class UserApplicationCommand {
  constructor(
    private readonly userApplicationService: UserApplicationService,
  ) {}
  spinner = ora();
  @Command({
    command: 'user-application:list',
    describe: 'Lists all user application mapping',
  })
  async listUserApplicationMapping() {
    this.spinner.start();
    try {
      const userApplications = await this.userApplicationService
        .getAllUserApplications()
        .finally(() => {
          this.spinner.stop();
        });

      if (userApplications.length > 0) {
        var Table = require('cli-table3');
        let table = new Table({
          head: ['id', 'user', 'application'],
          style: {
            head: [],
          },
        });

        for (const userApplication of userApplications) {
          const userData = await Users.findOne({
            where: { id: userApplication.userId },
          });
          const applicationData = await Applications.findOne({
            where: { id: userApplication.applicationId },
          });

          table.push([
            userApplication.dataValues.id,
            userData.dataValues.displayName,
            applicationData.dataValues.name,
          ]);
        }
      } else {
        this.spinner.fail('No mapping found.');
      }
    } catch (error) {
      this.spinner.fail(error.message);
    }
  }

  @Command({
    command: 'user-application:link',
    describe: 'Link a new user to application',
  })
  async createUser() {
    const userInput = await prompt([
      {
        type: 'number',
        name: 'userId',
        message: 'Enter the userId:',
        validate: (input) => {
          if (!input) {
            return 'User id is required';
          }
          return true;
        },
      },
      {
        type: 'number',
        name: 'applicationId',
        message: 'Enter the applicationId:',
        validate: (input) => {
          if (!input) {
            return 'Application id is required';
          }
          return true;
        },
      },
    ]);
    this.spinner.start();
    const isUserFound = await Users.findOne({
      where: {
        id: userInput.userId,
      },
    });
    const isApplicationFound = await Applications.findOne({
      where: {
        id: userInput.applicationId,
      },
    });
    if (!isUserFound || !isApplicationFound) {
      this.spinner.fail('User or application not found');
      return;
    }
    const result = await this.userApplicationService.linkUserToApplication(
      userInput.userId,
      userInput.applicationId,
    );

    if (result.statusCode == 200) {
      this.spinner.succeed(result.message);
    } else {
      this.spinner.fail(result.message);
    }
  }

  @Command({
    command: 'user-application:delete <linkId>',
    describe: 'Delete a mapping with id',
  })
  async deleteUser(
    @Positional({
      name: 'linkId',
      describe: 'The user id to delete',
      type: 'number',
    })
    linkId: Number,
  ) {
    this.spinner.start();
    const result = await this.userApplicationService.deleteMapping(linkId);

    if (result.statusCode == 200) {
      this.spinner.succeed(result.message);
    } else {
      this.spinner.fail(result.message);
    }
  }
}
