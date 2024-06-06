import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RolesDto {
  @ApiProperty({
    example: 'ADMIN',
  })
  @IsNotEmpty({ message: 'name cannot be blank' })
  name: string;
}
export class RolesDataDto {
  @ApiProperty({
    example: 1,
  })
  id: number;

  @ApiProperty({
    example: 'ADMIN',
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

export class RolesCreateSuccessDto {
  @ApiProperty({
    example: 'Role created successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    isArray: true,
    type: RolesDataDto,
  })
  data: RolesDataDto[];
}

export class RolesDeleteSuccessDto {
  @ApiProperty({
    example: 'Role deleted successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    isArray: true,
    type: RolesDataDto,
  })
  data: RolesDataDto[];
}

export class RolesUpdateSuccessDto {
  @ApiProperty({
    example: 'Role updated successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    isArray: true,
    type: RolesDataDto,
  })
  data: RolesDataDto[];
}
