import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from 'src/common/validators/match.validator';

export class ResetPasswordDto {
  @ApiProperty({
    example: 171704727812,
  })
  expires: number;

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

export class ResetPasswordSuccessDto {
  @ApiProperty({
    example: 200,
  })
  statusCode: number;
  @ApiProperty({
    example: 'Password updated successfully',
  })
  message: number;
}
