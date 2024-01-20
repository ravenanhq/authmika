import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { Match } from 'src/common/validators/match.validator';

export class ResetPasswordDto {
  expires: number;

  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s)(?=.*[!@#$*])/, {
    message:
      'Must contain: 8 or more characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.',
  })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('password', { message: 'Confirm password should match with password' })
  confirmPassword: string;
}