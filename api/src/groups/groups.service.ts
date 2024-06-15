import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
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

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Groups)
    private groupModel: typeof Groups,
  ) {}

  async getGroupList(): Promise<GroupsData[]> {
    try {
      const groups = await this.groupModel.findAll({ where: { status: 1 } });

      if (groups && groups.length == 0) {
        throw new NotFoundException('No groups found');
      }
      return groups;
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
  ): Promise<GroupCreateSuccessDto> {
    const { name } = groupsDto;
    try {
      const existingGroup = await this.groupModel.findOne({
        where: { name: name },
      });
      if (existingGroup) {
        throw new ConflictException('Name already exists.');
      } else {
        const newGroup = await this.groupModel.create({
          name: name,
          createdBy: user.userId,
        });

        if (!newGroup) {
          throw new InternalServerErrorException('Group creation failed');
        }
      }
      const groups = await this.groupModel.findAll({
        where: { status: 1 },
      });
      return {
        message: 'Group created successfully',
        statusCode: HttpStatus.CREATED,
        data: groups,
      };
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
          throw new UnprocessableEntityException('Name already exists.');
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
