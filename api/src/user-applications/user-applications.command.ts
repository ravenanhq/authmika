import { UserApplicationService } from './user-applications.service';
import { Command, Positional } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { prompt } from 'enquirer';
import { Users } from 'src/db/model/users.model';
import { Applications } from 'src/db/model/applications.model';

interface IUserInput {
  userId: number;
  applicationId: number;
}

@Injectable()
export class UserApplicationCommand {
  constructor(
    private readonly userApplicationService: UserApplicationService,
  ) {}
  @Command({
    command: 'user-application:list',
    describe: 'Lists all user application mapping',
  })
  async listUserApplicationMapping() {
    try {
      const userApplications =
        await this.userApplicationService.getAllUserApplications();
      if (userApplications.length > 0) {
        const userApplicationList = [];
        for (const userApplication of userApplications) {
          const userData = await Users.findOne({
            where: { id: userApplication.userId },
          });
          const applicationData = await Applications.findOne({
            where: { id: userApplication.applicationId },
          });

          userApplicationList.push({
            id: userApplication.dataValues.id,
            user: userData.dataValues.displayName,
            application: applicationData.dataValues.name,
          });
        }
        console.table(userApplicationList, ['id', 'user', 'application']);
      } else {
        console.log('No mapping found.');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  @Command({
    command: 'user-application:link',
    describe: 'Link a new user to application',
  })
  async createUser() {
    await prompt([
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
    ]).then(async (userInput: IUserInput) => {
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
        console.log('User or application not found');
        return;
      }
      const result = await this.userApplicationService.linkUserToApplication(
        userInput.userId,
        userInput.applicationId,
      );

      if (result.statusCode == 200) {
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    });
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
    linkId: number,
  ) {
    const result = await this.userApplicationService.deleteMapping(linkId);

    if (result.statusCode == 200) {
      console.log(result.message);
    } else {
      console.error(result.message);
    }
  }
}
