import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Email cannot be blank.' })
  email: string;

  @IsNotEmpty({ message: 'Password cannot be blank.' })
  password: string;

  clientId: string;
}
