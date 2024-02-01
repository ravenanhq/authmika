import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthClientsService } from './auth-clients.service';

@Controller('auth-clients')
export class AuthClientsController {
  constructor(private authClientService: AuthClientsService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  @UsePipes(new ValidationPipe())
  saveClientDetails(@Request() req) {
    return this.authClientService.saveClientDetails(req.body.key);
  }
}
