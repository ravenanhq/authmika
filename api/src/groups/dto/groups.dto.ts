import { IsNotEmpty, Matches } from 'class-validator';

export class GroupsDto {
  @Matches(/^[^\s]+$/, { message: 'Spaces are not allowed in the group' })
  @IsNotEmpty({ message: 'name cannot be blank' })
  name: string;
}
