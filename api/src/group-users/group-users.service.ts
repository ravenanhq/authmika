import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { GroupUsers } from 'src/db/model/group-users.model';
import { UserApplications } from 'src/db/model/user-applications.model';
import { Users } from 'src/db/model/users.model';

interface MyArray<T> extends Array<T> {}

@Injectable()
export class GroupUsersService {
  constructor(
    @InjectModel(GroupUsers)
    private groupUsersModel: typeof GroupUsers,
    @InjectModel(Users)
    private readonly userModel: typeof Users,
    @InjectModel(UserApplications)
    private userApplictionsModel: typeof UserApplications,
  ) {}

  async getUsers() {
    try {
      const users = await this.userModel.findAll({
        where: { status: 1 },
      });
      return users;
    } catch (error) {
      throw new HttpException(
        'Error getting users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(groupId: number, userId: MyArray<number>) {
    if (groupId == undefined || groupId == null) {
      return {
        message: 'Group Id not supplied.',
        statusCode: HttpStatus.OK,
      };
    }

    await this.groupUsersModel.destroy({
      where: {
        groupId: groupId,
      },
    });

    userId.forEach(async (item) => {
      await this.groupUsersModel.create({
        groupId: groupId,
        userId: item,
      });
    });

    return {
      message: 'User and group mapped successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async getUsersByGroupId(groupId?: number): Promise<{
    groupId?: number;
    userId?: number;
  }> {
    try {
      const whereCondition: any = {};
      if (groupId !== undefined) {
        whereCondition.groupId = groupId;
      }

      const userGroups = await this.groupUsersModel.findAll({
        where: whereCondition,
      });

      const detailedUserGroups: any = [];
      for (const userApp of userGroups) {
        const detailedUserGroup = {
          groupId: userApp.groupId,
          userId: userApp.userId,
        };
        detailedUserGroups.push(detailedUserGroup);
      }
      return detailedUserGroups;
    } catch (error) {
      console.error('Error fetching user groups:', error);
      throw error;
    }
  }

  async getApplicationsByGroupId(groupId?: number): Promise<{
    groupId?: number;
    id?: number;
  }> {
    try {
      const whereCondition: any = {};
      if (groupId !== undefined) {
        whereCondition.groupId = groupId;
      }

      const userGroups = await this.groupUsersModel.findAll({
        where: whereCondition,
      });

      const detailedUserGroups: any = [];
      for (const userGroup of userGroups) {
        const userApplications = await this.userApplictionsModel.findAll({
          where: {
            userId: userGroup.userId,
          },
        });

        for (const userApp of userApplications) {
          const detailedUserGroup = {
            id: userApp.applicationId,
          };
          detailedUserGroups.push(detailedUserGroup);
        }
      }

      return detailedUserGroups;
    } catch (error) {
      console.error('Error fetching user applications:', error);
      throw error;
    }
  }

  async userAndApplicationAssigning(
    groupId: number,
    userId: MyArray<string>,
    applicationId: MyArray<string>,
  ) {
    if (groupId == undefined || groupId == null) {
      return {
        message: 'group Id not supplied.',
        statusCode: HttpStatus.OK,
      };
    }
    if (!groupId) {
      throw new HttpException(
        {
          message: 'Invalid group ID.',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const whereCondition: any = { groupId };

    const groupUsers = await this.groupUsersModel.findAll({
      where: whereCondition,
    });

    if (!Array.isArray(userId) || userId.length === 0) {
      return {
        message: 'No user IDs provided.',
        statusCode: HttpStatus.OK,
      };
    }
    if (!Array.isArray(applicationId) || applicationId.length === 0) {
      return {
        message: 'No applications provided.',
        statusCode: HttpStatus.OK,
      };
    }
    const numericUserIds: number[] = userId.map((id) => {
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        throw new Error(`Invalid user ID: ${id}`);
      }
      return numericId;
    });
    await this.groupUsersModel.destroy({
      where: {
        groupId: groupId,
      },
    });

    for (const groupUser of groupUsers) {
      await this.userApplictionsModel.destroy({
        where: {
          userId: groupUser.userId,
        },
      });
    }

    for (const numericUserId of numericUserIds) {
      await this.groupUsersModel.create({
        groupId: groupId,
        userId: numericUserId,
      });

      for (const appId of applicationId) {
        await this.userApplictionsModel.create({
          userId: numericUserId,
          applicationId: appId,
        });
      }
    }

    throw new HttpException(
      {
        message: 'User and application assigned successfully',
        statusCode: HttpStatus.CREATED,
        data: null,
      },
      HttpStatus.CREATED,
    );
  }
}
