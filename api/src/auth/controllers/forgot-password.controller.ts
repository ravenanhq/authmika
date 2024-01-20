import { Body, Controller, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { ForgotPasswordService } from '../services/forgot-password.service';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

@Controller('/forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotpasswordservice: ForgotPasswordService) {}

  @Post()
  async sendMail(@Body() body: ForgotPasswordDto) {
    const response = this.forgotpasswordservice.createToken(body.email);
    return response;
  }
}
