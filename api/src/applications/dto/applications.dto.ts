import { IsNotEmpty, Matches } from 'class-validator';

export class ApplicationsDto {
  @Matches(/^[^\s]+$/, { message: 'Spaces are not allowed in the application' })
  @IsNotEmpty({ message: 'Application cannot be blank' })
  application: string;

  @IsNotEmpty({ message: 'Application name cannot be blank' })
  name: string;

  @IsNotEmpty({ message: 'Base URL cannot be blank' })
  base_url: string;
}
