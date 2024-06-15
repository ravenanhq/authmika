import { ApiProperty } from '@nestjs/swagger';

export class AuthClientsSuccessDto {
  @ApiProperty({
    example: 'Client details added.',
  })
  message: string;
  @ApiProperty({
    example: 1,
  })
  statusCode: number;
  @ApiProperty({
    example: 1,
  })
  clientId: number;
}
