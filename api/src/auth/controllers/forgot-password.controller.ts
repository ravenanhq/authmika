import { Body, Controller, Post } from '@nestjs/common';
import { ForgotPasswordService } from '../services/forgot-password.service';
import {
  ForgotPasswordDto,
  ForgotPasswordSuccessDto,
} from '../dto/forgot-password.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/forgot-password')
export class ForgotPasswordController {
  constructor(private readonly forgotpasswordservice: ForgotPasswordService) {}

  @ApiTags('Auth')
  @ApiResponse({
    status: 200,
    description: 'Mail Sent',
    type: ForgotPasswordSuccessDto,
  })
  @ApiResponse({
    status: 500,
    description: 'Failed to send email',
  })
  @ApiOperation({ summary: 'Forgot password' })
  @Post()
  async sendMail(@Body() body: ForgotPasswordDto) {
    const response = this.forgotpasswordservice.createToken(body.email);
    return response;
  }
}
