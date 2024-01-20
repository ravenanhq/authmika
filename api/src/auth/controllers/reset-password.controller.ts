import { Controller, Get, Param, Query } from '@nestjs/common';
import { ResetPasswordService } from '../services/reset-password.service';
import {
  ResetPasswordDto
} from '../dto/reset-password.dto';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}
  @Get(':token')
  async resetPassword(
    @Param('token') token: string,
    @Query() queryParams: ResetPasswordDto,
  ) {
    const response = this.resetPasswordService.resetPassword(
      token,
      queryParams,
    );
    return response;
  }
}
