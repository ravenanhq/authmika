import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Username cannot be blank.' })
  username: string;

  @IsNotEmpty({ message: 'Password cannot be blank.' })
  password: string;
}
