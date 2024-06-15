import { Controller, Get, Param, Query } from '@nestjs/common';
import { ResetPasswordService } from '../services/reset-password.service';
import {
  ResetPasswordDto,
  ResetPasswordSuccessDto,
} from '../dto/reset-password.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @ApiTags('Users')
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: ResetPasswordSuccessDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Not found',
  })
  @ApiResponse({
    status: 410,
    description: 'Gone',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  @ApiOperation({ summary: 'Reset password' })
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
