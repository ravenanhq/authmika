import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { UserDataDto } from 'src/auth/dto/login.dto';
import { Match } from 'src/common/validators/match.validator';
import { Users } from 'src/db/model/users.model';

export class UsersDto {
  @Matches(/^[^\s]+$/, { message: 'Spaces are not allowed in the user' })
  @IsNotEmpty({ message: 'firstname cannot be blank' })
  firstName: string;

  @IsNotEmpty({ message: 'lastname cannot be blank' })
  lastName: string;

  @Matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    {
      message: ' Invalid email address',
    },
  )
  @IsNotEmpty({ message: 'email cannot be blank' })
  email: string;

  password: string;

  @IsNotEmpty({ message: 'mobile cannot be blank' })
  mobile: string;

  @IsNotEmpty({ message: 'role cannot be blank' })
  role: string;

  @IsNotEmpty({ message: 'group cannot be blank' })
  groupId: number;

  currentPassword: string;

  confirmPassword: string;
}

export class AddUsersDto {
  @ApiProperty({
    type: 'string',
    example: 'firstName',
  })
  @Matches(/^[^\s]+$/, { message: 'Spaces are not allowed in the user' })
  @IsNotEmpty({ message: 'firstname cannot be blank' })
  firstName: string;

  @ApiProperty({
    type: 'string',
    example: 'lastName',
  })
  @IsNotEmpty({ message: 'lastname cannot be blank' })
  lastName: string;

  @ApiProperty({
    type: 'email',
    example: 'user@gmail.com',
  })
  @Matches(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

    {
      message: ' Invalid email address',
    },
  )
  @IsNotEmpty({ message: 'email cannot be blank' })
  email: string;

  password: string;

  @ApiProperty({
    type: 'number',
    example: 9092454545,
  })
  @IsNotEmpty({ message: 'mobile cannot be blank' })
  mobile: string;

  @ApiProperty({
    type: 'string',
    example: 'CLIENT',
  })
  @IsNotEmpty({ message: 'role cannot be blank' })
  role: string;

  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @IsNotEmpty({ message: 'groupId cannot be blank' })
  groupId: string;
  id: number;
}

export class AddUserSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'User created successfully',
  })
  message: string;
  @ApiProperty({
    type: 'number',
    example: 204,
  })
  statusCode: number;
  @ApiProperty({
    type: UserDataDto,
    isArray: true,
  })
  data: Users[];
}

export class AddUserByApi extends AddUsersDto {
  @ApiProperty({
    example: 'Test@123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/]).{8,}$/,
    {
      message:
        'Must contain: 8 or more characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.',
    },
  )
  password: string;

  @ApiProperty({
    example: 'abcdefghijklmnopqrstuvwxyz',
  })
  @IsString()
  @IsNotEmpty({ message: 'Client secret key is required' })
  clientSecretKey: string;

  @ApiProperty({
    example: 'abcdefghijklmnopqrstuvwxyz',
  })
  @IsString()
  @IsNotEmpty({ message: 'Client secret id is required' })
  clientSecretId: string;
}

export class AddUserByApiSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'User created successfully',
  })
  message: string;
  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;
}

export class VerifyCurrentPasswordDataDto {
  @ApiProperty({
    type: 'string',
    example: 'Test@123',
  })
  currentPassword: string;
}

export class VerifyCurrentPasswordSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'Password verified successfully',
  })
  message: string;
  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;
}

export class CreatePasswordSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'Password added successfully',
  })
  message: string;
  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;
}

export class UpdatePasswordSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'Password updated successfully',
  })
  message: string;
  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;
}

export class UserActivationQueryParamsDto {
  @ApiProperty({
    example: '171704727812',
  })
  expires: number;
}
export class UserActivationSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'User activated successfully',
  })
  message: string;
  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;
}

export class GetUserSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'User created successfully',
  })
  message: string;
  @ApiProperty({
    type: 'number',
    example: 204,
  })
  statusCode: number;
  @ApiProperty({
    type: UserDataDto,
  })
  data: Users;
}

export class UpdateUserSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'User updated successfully',
  })
  message: string;
  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;
  @ApiProperty({
    type: UserDataDto,
    isArray: true,
  })
  data: Users[];
}

export class DeleteUserSuccessDto {
  @ApiProperty({
    type: 'string',
    example: 'User deleted successfully',
  })
  message: string;
  @ApiProperty({
    type: 'number',
    example: 200,
  })
  statusCode: number;
  @ApiProperty({
    type: UserDataDto,
    isArray: true,
  })
  data: Users[];
}

export class UpdatePasswordDataDto {
  @ApiProperty({
    type: 'string',
    example: 'Test@123',
  })
  password: string;

  @ApiProperty({
    type: 'string',
    example: 'Test@12345',
  })
  currentPassword: string;
}

export class VerifyOtpSuccessDto {
  @ApiProperty({
    example: true,
  })
  success: boolean;

  @ApiProperty({
    example: 'Otp is valid',
  })
  message: string;
}

export class DeactivateUserSuccessDto {
  @ApiProperty({
    example: 'User deactivated successfully',
  })
  message: string;

  @ApiProperty({
    example: 200,
  })
  statusCode: number;
}

export class ResendOtpParams {
  @ApiProperty({
    example: 200,
  })
  id: number;

  @ApiProperty({
    example: 'user@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'firstName',
  })
  firstName: string;

  @ApiProperty({
    example: 'lastName',
  })
  lastName: string;

  url: string;
}

export class ResendOtpSuccessDto {
  @ApiProperty({
    example: 'OTP resent successfully',
  })
  message: string;

  @ApiProperty({
    example: true,
  })
  success: boolean;
}

export class ResendActivationEmailDataDto {
  @ApiProperty({
    example: 'user@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'Firstname',
  })
  firstName: string;

  @ApiProperty({
    example: 'Lastname',
  })
  lastName: string;
}

export class ResendActivationEmailSuccessDto {
  @ApiProperty({
    example: 'User activation email sent successfully',
  })
  message: string;

  @ApiProperty({
    example: true,
  })
  success: boolean;
}

export class SavePasswordBodyDto {
  @IsNotEmpty({ message: 'User id is required' })
  @ApiProperty({
    example: 1,
  })
  id: number;
  @IsNotEmpty({ message: 'Email is required' })
  @ApiProperty({
    example: 'user@gmail.com',
  })
  email: string;
  @ApiProperty({
    example: 'Test@123',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/]).{8,}$/,
    {
      message:
        'Must contain: 8 or more characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.',
    },
  )
  password: string;
  @ApiProperty({
    example: 'Test@123',
  })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('password', { message: 'Confirm password should match with password' })
  confirmPassword: string;
}
