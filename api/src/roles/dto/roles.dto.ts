import { IsNotEmpty } from 'class-validator';

export class RolesDto {
  @IsNotEmpty({ message: 'name cannot be blank' })
  name: string;

  id: number;
}
