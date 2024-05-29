import { IsNotEmpty, Matches } from 'class-validator';

export class RolesDto {
  @Matches(/^[^\s]+$/, { message: 'Spaces are not allowed in the user' })
  @IsNotEmpty({ message: 'name cannot be blank' })
  name: string;

  id: number;
}
