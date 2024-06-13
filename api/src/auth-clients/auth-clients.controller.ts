import {
  Controller,
  Post,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthClientsService } from './auth-clients.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('auth-clients')
export class AuthClientsController {
  constructor(private authClientService: AuthClientsService) {}

  @ApiExcludeEndpoint()
  @Post('create')
  @UsePipes(new ValidationPipe())
  saveClientDetails(@Request() req) {
    return this.authClientService.saveClientDetails(req.body.key);
  }
}
