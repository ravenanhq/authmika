import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GroupsDto } from './dto/groups.dto';
import { InjectModel } from '@nestjs/sequelize';
import { Groups } from 'src/db/model/groups.model';
import { Op } from 'sequelize';

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Groups)
    private groupModel: typeof Groups,
  ) {}

  async getGroupList(): Promise<Groups[]> {
    try {
      const groups = await this.groupModel.findAll({ where: { status: 1 } });
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
    user: { userId: any },
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { name } = groupsDto;
    try {
      const existingGroup = await this.groupModel.findOne({
        where: { name: name },
      });
      if (existingGroup) {
        throw new NotFoundException('Name already exists.');
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
        statusCode: HttpStatus.OK,
        data: { groups },
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

  async update(
    groupsDto: GroupsDto,
    user: { userId: any },
    id: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
    const { name } = groupsDto;
    try {
      const existingGroup = await this.groupModel.findOne({
        where: { id: id },
      });
      if (existingGroup) {
        const existingUsername = await this.groupModel.findOne({
          where: { name: name },
        });
        if (
          existingUsername &&
          existingUsername.id.toString() !== id.toString()
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
        return {
          message: 'Group not found.',
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

  async delete(
    id: number,
  ): Promise<{ message: string; statusCode: number; data: object }> {
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
        return {
          message: 'Group not found.',
          statusCode: HttpStatus.NOT_FOUND,
          data: {},
        };
      }
    } catch (error) {
      return {
        message: 'An error occurred while deleting the group.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: {},
      };
    }
  }
}
