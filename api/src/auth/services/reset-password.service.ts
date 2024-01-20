import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PasswordResetTokens } from 'src/db/model/password-reset-tokens.model';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { Users } from 'src/db/model/users.model';
import { hash } from 'bcrypt';

@Injectable()
export class ResetPasswordService {
  constructor(
    @InjectModel(PasswordResetTokens)
    private passwordResetTokensModel: typeof PasswordResetTokens,
    @InjectModel(Users)
    private userModel: typeof Users,
  ) {}

  async resetPassword(
    token: string,
    queryParams: ResetPasswordDto,
  ): Promise<{ message: string; statusCode: number }> {
    const currentTime: number = new Date().getTime();
    const { expires, password } = queryParams;

    const passwordReset = await this.passwordResetTokensModel.findOne({
      where: { token },
    });
    if (!passwordReset)
      throw new HttpException(
        {
          message:
            "Apologies, but we couldn't locate the verification link you provided. The verification link appears to be invalid.",
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    if (expires < currentTime) {
      throw new HttpException(
        {
          message: 'Password reset link expired.',
          statusCode: HttpStatus.GONE,
        },
        HttpStatus.GONE,
      );
    }

    const { email } = passwordReset;
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'No account was found with the provided email.',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const hashedPassword = await hash(password, 10);
    const updatedUser = await this.userModel.update(
      { password: hashedPassword },
      { where: { email } },
    );

    if (updatedUser[0] === 1) {
      passwordReset.destroy();
      return {
        message: 'Password updated successfully',
        statusCode: HttpStatus.OK,
      };
    } else {
      throw new HttpException('Error', HttpStatus.BAD_REQUEST);
    }
  }
}
