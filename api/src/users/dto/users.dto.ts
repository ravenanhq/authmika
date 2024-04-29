import { IsNotEmpty, Matches } from 'class-validator';

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

  currentPassword: string;

  confirmPassword: string;
}
