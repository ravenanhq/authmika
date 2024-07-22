import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Users } from 'src/db/model/users.model';

export class UserDataDto {
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
  @ApiProperty({
    type: 'string',
    example: null,
  })
  profile: string | null;
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

export class LoginDto {
  @ApiProperty({ type: 'string', example: 'test@gmail.com' })
  @IsNotEmpty({ message: 'Email cannot be blank.' })
  email: string;

  @ApiProperty({ type: 'string', example: 'Test@123' })
  @IsNotEmpty({ message: 'Password cannot be blank.' })
  password: string;

  @ApiProperty({ type: 'string', example: '' })
  clientId: string;
}

export class LoginSuccessDto {
  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImZpcnN0TmFtZSI6IlRlc3QiLCJpYXQiOjE3MTY5NjcwMzgsImV4cCI6MTcxNjk2NzAzOH0.Wkz29xDby4kyXo2rrJqzBON6y-GwdIyrxBaCVXDVlFk',
  })
  access_token: string;

  @ApiProperty({
    type: 'string',
    example: 'Bearer',
  })
  token_type: string;

  @ApiProperty({
    type: UserDataDto,
  })
  user: Users;

  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImZpcnN0TmFtZSI6IlRlc3QiLCJpYXQiOjE3MTY5NjcwMzgsImV4cCI6MTcxNjk2NzAzOH0.Wkz29xDby4kyXo2rrJqzBON6y-GwdIyrxBaCVXDVlFk',
  })
  apiToken: string;
}

export class QuickSignInDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  userId: number;
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  applicationId: number;
}

export class QuickSignInSuccessDto {
  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;
  @ApiProperty({
    type: 'string',
  })
  callBackUrl: string;
  @ApiProperty({
    type: 'string',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImZpcnN0TmFtZSI6IlRlc3QiLCJpYXQiOjE3MTY5NjcwMzgsImV4cCI6MTcxNjk2NzAzOH0.Wkz29xDby4kyXo2rrJqzBON6y-GwdIyrxBaCVXDVlFk',
  })
  apiToken: string;
}
