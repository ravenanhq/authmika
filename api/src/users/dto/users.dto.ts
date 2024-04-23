import { IsNotEmpty, Matches } from 'class-validator';

export class UsersDto {
  @Matches(/^[^\s]+$/, { message: 'Spaces are not allowed in the user' })
  @IsNotEmpty({ message: 'username cannot be blank' })
  user_name: string;

  @IsNotEmpty({ message: 'displayname cannot be blank' })
  display_name: string;

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

  currentPassword: string;

  confirmPassword: string;
}
