import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    type: 'string',
    example: 'user@gmail.com',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

export class ForgotPasswordSuccessDto {
  @ApiProperty({
    example: 'Password reset link has sent to user@gmail.com',
  })
  message: string;
  @ApiProperty({
    example: 200,
  })
  statusCode: number;
}
