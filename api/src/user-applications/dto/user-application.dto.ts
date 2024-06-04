import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { ApplicationsDataDto } from 'src/applications/dto/applications.dto';

export class UserApplicationCreateBodyDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty({ message: 'User id is required' })
  userId: number;

  @ApiProperty({
    example: ['1', '2', '3'],
    type: Array,
  })
  @IsNotEmpty({ message: 'Application id is required' })
  applicationId: Array<string>;
}

export class UserApplicationCreateDto {
  @ApiProperty({
    example: 'User and application mapped successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;
}

export class UserApplicationGetBodyDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty({ message: 'User id is required' })
  userId: number;
}

export class UserApplicationGetSuccessDto {
  @ApiProperty({
    example: 1,
  })
  id?: number;

  @ApiProperty({
    example: 1,
  })
  userId?: number;

  @ApiProperty({
    type: ApplicationsDataDto,
    isArray: true,
  })
  application: ApplicationsDataDto[];
}

export class UserApplicationDeleteBodyDto {
  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty({ message: 'User id is required' })
  userId: number;

  @ApiProperty({
    example: 1,
  })
  @IsNotEmpty({ message: 'User id is required' })
  applicationId: number;
}

export class UserApplicationDeleteSuccessDto {
  @ApiProperty({
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    example: 'Mapping deleted successfully',
  })
  message: string;
}
