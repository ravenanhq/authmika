import {
  Controller,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthClientsService } from './auth-clients.service';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { AuthClientsSuccessDto } from './dto/auth-clients.dto';

@Controller('auth-clients')
export class AuthClientsController {
  constructor(private authClientService: AuthClientsService) {}

  @ApiTags('Roles')
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: AuthClientsSuccessDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Save auth client details' })
  @Post('create')
  @UsePipes(new ValidationPipe())
  saveClientDetails(@Request() req) {
    return this.authClientService.saveClientDetails(req.body.key);
  }
}
