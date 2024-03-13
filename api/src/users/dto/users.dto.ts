import { IsNotEmpty, Matches } from 'class-validator';

export class UsersDto {
  @Matches(/^[^\s]+$/, { message: 'Spaces are not allowed in the user' })
  @IsNotEmpty({ message: 'username cannot be blank' })
  user_name: string;

  @IsNotEmpty({ message: 'displayname cannot be blank' })
  display_name: string;

  @IsNotEmpty({ message: 'email cannot be blank' })
  email: string;

  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*()-_+={}[\]|\\:;"'<>,.?/]).{8,}$/,
    {
      message:
        'Must contain: 8 or more characters, 1 uppercase, 1 lowercase, 1 number, 1 special character.',
    },
  )
  password: string;

  @IsNotEmpty({ message: 'mobile cannot be blank' })
  mobile: string;

  @IsNotEmpty({ message: 'role cannot be blank' })
  role: string;
}