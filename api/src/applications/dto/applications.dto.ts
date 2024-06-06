import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class ApplicationsDto {
  @ApiProperty({
    type: 'string',
    example: 'exampleapplication',
  })
  @Matches(/^[^\s]+$/, { message: 'Spaces are not allowed in the application' })
  @IsNotEmpty({ message: 'Application cannot be blank' })
  application: string;

  @ApiProperty({
    type: 'string',
    example: 'Example Application',
  })
  @IsNotEmpty({ message: 'Application name cannot be blank' })
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'https://example.com',
  })
  @IsNotEmpty({ message: 'Base URL cannot be blank' })
  base_url: string;

  @ApiProperty({
    type: 'string',
    example: 'https://example.com/redirect',
  })
  @IsNotEmpty({ message: 'Call back URL cannot be blank' })
  call_back_url: string;

  logo_path: string;

  file: string;
}

export class ApplicationsDataDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  id: number;

  @ApiProperty({
    type: 'string',
    example: 'test',
  })
  name: string;

  @ApiProperty({
    type: 'string',
    example: 'test',
  })
  application: string;

  @ApiProperty({
    type: 'string',
    example: 'test.com',
  })
  baseUrl: string;

  @ApiProperty({
    type: 'string',
    example: 'test.com',
  })
  callBackUrl: string;

  @ApiProperty({
    type: 'string',
    example: null,
  })
  logoPath: string | null;

  @ApiProperty({
    type: 'string',
    example: 'c1ea21d376157ac01cb39c6f5ed5c310',
  })
  clientSecretId: string;

  @ApiProperty({
    type: 'string',
    example: 'ac3604653a49772f5ee3b372a26922ee5aefef45160d1e1b053a7eb6e2f6cd15',
  })
  clientSecretKey: string;

  @ApiProperty({
    type: 'number',
    example: null,
  })
  createdBy: number | null;

  @ApiProperty({
    type: 'number',
    example: null,
  })
  updatedBy: number | null;

  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    type: 'string',
    example: '2024-05-15T12:42:08.000Z',
  })
  created_at?: string;

  @ApiProperty({
    type: 'string',
    example: '2024-05-15T12:42:08.000Z',
  })
  updated_at?: string;
}

export class ApplicationCreateDataDto {
  @ApiProperty({
    type: 'string',
    example: 'Example Application',
  })
  name: string;
  @ApiProperty({
    type: 'string',
    example: 'exampleapplication',
  })
  application: string;
  @ApiProperty({
    type: 'string',
    example: 'https://example.com',
  })
  base_url: string;
  @ApiProperty({
    type: 'string',
    example: 'https://example.com/redirect',
  })
  call_back_url: string;
  logo_path: string;
  file: string;
}

export class ApplicationCreateSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'Application created successfully',
  })
  message: string;

  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    type: ApplicationsDataDto,
    isArray: true,
  })
  data: ApplicationsDataDto[];
}

export class ApplicationGetSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'Application data found',
  })
  message: string;

  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    type: ApplicationsDataDto,
  })
  data: ApplicationsDataDto;
}

export class ApplicationUpdateSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'Application updated successfully',
  })
  message: string;

  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    type: ApplicationsDataDto,
  })
  data: ApplicationsDataDto;
}

export class ApplicationDeleteSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'Application deleted successfully',
  })
  message: string;

  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    type: ApplicationsDataDto,
    isArray: true,
  })
  data: ApplicationsDataDto[];
}

export class GetApplicationIdSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'Success',
  })
  message: string;

  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  applicationId: number;
}
