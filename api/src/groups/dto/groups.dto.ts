import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class GroupsDto {
  @ApiProperty({
    example: 'Group Name',
  })
  @IsNotEmpty({ message: 'name cannot be blank' })
  name: string;
}

export class GroupsData {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'Group Name',
  })
  name: string;

  @ApiProperty({
    example: 1,
  })
  status: number;

  @ApiProperty({
    example: 1,
  })
  createdBy: number;

  @ApiProperty({
    example: 1,
  })
  updatedBy: number;
}

export class GroupCreateSuccessDto {
  @ApiProperty({
    example: 'Group created successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    type: GroupsData,
    isArray: true,
  })
  data: GroupsData[];
}

export class GroupDeleteSuccessDto {
  @ApiProperty({
    example: 'Group deleted successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    type: GroupsData,
    isArray: true,
  })
  data: GroupsData[];
}

export class GroupUpdateSuccessDto {
  @ApiProperty({
    example: 'Group updated successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    type: GroupsData,
    isArray: true,
  })
  data: GroupsData[];
}
