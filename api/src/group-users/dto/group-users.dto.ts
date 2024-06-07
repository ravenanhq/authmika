import { ApiProperty } from '@nestjs/swagger';

export class GroupUsersData {
  @ApiProperty({ type: 'number', example: 1 })
  id: number;
  @ApiProperty({ type: 'string', example: 'Test' })
  firstName: string;
  @ApiProperty({ type: 'string', example: 'User' })
  lastName: string;
  @ApiProperty({ type: 'string', example: 'test@gmail.com' })
  email: string;
  @ApiProperty({ type: 'date', example: '2024-05-15T06:10:55.000Z' })
  emailVerifiedAt: Date;
  @ApiProperty({
    type: 'string',
    example: '$2b$10$p1rhV1jaaKfI/swj8lLfNOjlsjl4CaoUZnGIyyX1vpRALDkn0v0Bm',
  })
  password: string;
  @ApiProperty({ type: 'number', example: 4525856854 })
  mobile: number;
  @ApiProperty({ type: 'string', example: 'CLIENT' })
  role: 'CLIENT';
  @ApiProperty({ type: 'boolean', example: false })
  isTwoFactorEnabled: boolean;
  @ApiProperty({ type: 'string', example: null })
  two_factor_secret: string;
  @ApiProperty({ type: 'string', example: null })
  twoFactorRecoveryCodes: string;
  @ApiProperty({ type: 'number', example: 2 })
  createdBy: number;
  @ApiProperty({ type: 'number', example: 2 })
  updatedBy: number;
  @ApiProperty({ type: 'string', example: null })
  emailVerificationToken: string;
  @ApiProperty({ type: 'number', example: 1 })
  status: 1;
  @ApiProperty({ type: 'string', example: null })
  otp: string;
  @ApiProperty({ type: 'date', example: '2024-05-15T06:10:55.000Z' })
  otp_expiration: Date;
  @ApiProperty({ type: 'date', example: '2024-05-15T06:10:55.000Z' })
  created_at: Date;
  @ApiProperty({ type: 'date', example: '2024-05-15T06:10:55.000Z' })
  updated_at: Date;
}

export class GroupAndUserMap {
  @ApiProperty({
    example: 'User and group mapped successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;
}

export class GroupUserApplicationGetSuccessDto {
  @ApiProperty({
    example: 1,
  })
  groupId?: number;

  @ApiProperty({
    example: 1,
  })
  userId?: number;
}

export class GroupApplicationGetSuccessDto {
  @ApiProperty({
    example: 1,
  })
  id?: number;

  @ApiProperty({
    example: 1,
  })
  groupId?: number;
}

export class GroupApplicationGetBodyDto {
  @ApiProperty({
    example: 1,
  })
  userId: number;
  @ApiProperty({
    example: 1,
  })
  groupId: number;
}

export class GroupApplicationCreateDto {
  @ApiProperty({
    example: 'Group and application mapped successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;
}
