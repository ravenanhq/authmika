import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  GroupCreateSuccessDto,
  GroupDeleteSuccessDto,
  GroupsData,
  GroupsDto,
  GroupUpdateSuccessDto,
} from './dto/groups.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Groups } from 'src/db/model/groups.model';
import { Op } from 'sequelize';
import { GroupUsers } from 'src/db/model/group-users.model';
import { UserApplications } from 'src/db/model/user-applications.model';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Groups)
    private groupModel: typeof Groups,
    @InjectModel(GroupUsers)
    private groupUsersModel: typeof GroupUsers,
    @InjectModel(UserApplications)
    private userApplictionsModel: typeof UserApplications,
  ) {}

  async getGroupList() // isListPage: boolean,
  // applicationId?: number,
  : Promise<GroupsData[]> {
    try {
      // if (isListPage === true || applicationId === 0 || applicationId == null) {
      const groups = await this.groupModel.findAll({ where: { status: 1 } });

      if (groups && groups.length == 0) {
        throw new NotFoundException('No groups found');
      }
      return groups;
      // } else {
      //   const userApplications = await this.userApplictionsModel.findAll({
      //     where: { applicationId: applicationId },
      //   });

      //   if (!userApplications || userApplications.length === 0) {
      //     throw new NotFoundException('No users found for this application');
      //   }
      //   const userIds = userApplications.map(
      //     (userApplication) => userApplication.userId,
      //   );

      //   const groupIds = await this.groupUsersModel.findAll({
      //     where: { userId: userIds },
      //   });

      //   const uniqueGroupIds = Array.from(
      //     new Set(groupIds.map((item) => item.groupId)),
      //   );

      //   const groups = await this.groupModel.findAll({
      //     where: { id: uniqueGroupIds, status: 1 },
      //   });
      //   return groups;
      // }
    } catch (error) {
      throw new HttpException(
        'Error getting groups',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(
    groupsDto: GroupsDto,
    user: { userId: number },
    // isView: boolean,
    // applicationId?: number,
  ): Promise<GroupCreateSuccessDto> {
    const { name } = groupsDto;
    let newGroup;
    try {
      const existingGroup = await this.groupModel.findOne({
        where: { name: name },
      });
      if (existingGroup) {
        throw new ConflictException('Name already exists.');
      } else {
        newGroup = await this.groupModel.create({
          name: name,
          createdBy: user.userId,
        });
        if (!newGroup) {
          throw new InternalServerErrorException('Group creation failed');
        }
      }
      // if (isView === true || applicationId === 0 || applicationId == null) {
      const groups = await this.groupModel.findAll({
        where: { status: 1 },
      });
      return {
        message: 'Group created successfully',
        statusCode: HttpStatus.CREATED,
        data: groups,
      };
      // } else {
      //   const userApplications = await this.userApplictionsModel.findAll({
      //     where: { applicationId: applicationId },
      //   });

      //   if (!userApplications || userApplications.length === 0) {
      //     throw new NotFoundException('No users found for this application');
      //   }
      //   const userIds = userApplications.map(
      //     (userApplication) => userApplication.userId,
      //   );

      //   userIds.forEach(async (item) => {
      //     await this.groupUsersModel.create({
      //       groupId: newGroup.id,
      //       userId: item,
      //     });
      //   });

      //   const groupIds = await this.groupUsersModel.findAll({
      //     where: { userId: userIds },
      //     attributes: ['groupId'],
      //   });

      //   const uniqueGroupIds = Array.from(
      //     new Set(groupIds.map((item) => item.groupId)),
      //   );

      //   const groups = await this.groupModel.findAll({
      //     where: { id: uniqueGroupIds, status: 1 },
      //   });
      //   console.log('aaa', groupIds);

      //   return {
      //     message: 'Group fetched successfully',
      //     statusCode: HttpStatus.OK,
      //     data: groups,
      //   };
      // }
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.CONFLICT,
            data: null,
          },
          HttpStatus.CONFLICT,
        );
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

  async update(
    groupsDto: GroupsDto,
    user: { userId: any },
    id: number,
  ): Promise<GroupUpdateSuccessDto> {
    const { name } = groupsDto;
    try {
      const existingGroup = await this.groupModel.findOne({
        where: { id: id },
      });
      if (existingGroup) {
        const existingGroupname = await this.groupModel.findOne({
          where: { name: name },
        });
        if (
          existingGroupname &&
          existingGroupname.id.toString() !== id.toString()
        ) {
          throw new HttpException(
            {
              message: 'Name already exists',
              statusCode: HttpStatus.CONFLICT,
              data: null,
            },
            HttpStatus.CONFLICT,
          );
        }
        existingGroup.name = name;
        existingGroup.updatedBy = user.userId;
        await existingGroup.save();

        const groups = await this.groupModel.findAll({
          where: { status: { [Op.or]: [1, 2] } },
        });

        return {
          message: 'Group updated successfully.',
          statusCode: HttpStatus.OK,
          data: groups,
        };
      } else {
        throw new HttpException(
          {
            message: 'Group not found.',
            statusCode: HttpStatus.NOT_FOUND,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException(
          {
            message: error.message,
            statusCode: HttpStatus.CONFLICT,
            data: null,
          },
          HttpStatus.CONFLICT,
        );
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

  async delete(id: number): Promise<GroupDeleteSuccessDto> {
    try {
      const group = await this.groupModel.findOne({
        where: {
          id,
          status: true,
        },
      });

      if (group) {
        group.status = 0;
        await group.save();

        const groups = await this.groupModel.findAll({
          where: { status: true },
        });

        return {
          message: 'Group deleted successfully.',
          statusCode: HttpStatus.OK,
          data: groups,
        };
      } else {
        throw new HttpException(
          {
            message: 'Group not found.',
            statusCode: HttpStatus.NOT_FOUND,
            data: null,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (error) {
      throw new HttpException(
        {
          message: 'An error occurred while deleting the group.',
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          data: null,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
