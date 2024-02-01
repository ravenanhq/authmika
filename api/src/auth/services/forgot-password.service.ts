import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { randomBytes } from 'crypto';
import { PasswordResetTokens } from 'src/db/model/password-reset-tokens.model';
import { Users } from 'src/db/model/users.model';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class ForgotPasswordService {
  constructor(
    @InjectModel(PasswordResetTokens)
    private passwordResetTokensModel: typeof PasswordResetTokens,
    @InjectModel(Users)
    private userModel: typeof Users,
    private readonly mailservice: MailService,
  ) {}

  async createToken(
    email: string,
  ): Promise<{ message: string; statusCode: number }> {
    const user = await this.userModel.findOne({
      where: { email },
    });

    if (!user) {
      throw new HttpException(
        {
          message: 'User Not Found',
          statusCode: HttpStatus.NOT_FOUND,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const token = randomBytes(32).toString('hex');
    const currentDate = new Date();
    const expires = new Date(
      currentDate.getTime() +
        parseInt(process.env.PASSWORD_RESET_EXPIRATION_TIME, 10) * 60000,
    );
    const url = `${
      process.env.BASE_URL
    }/reset-password/?key=${token}&expires=${expires.getTime()}`;

    const oldToken = await this.passwordResetTokensModel.findOne({
      where: { email },
    });
    if (oldToken) {
      await this.passwordResetTokensModel.update(
        { token: token },
        { where: { email } },
      );
    } else {
      await this.passwordResetTokensModel.create({ email, token });
    }

    return this.mailservice
      .sendForgotPasswordEmail(email, url)
      .then((isMailSend) => {
        if (isMailSend) {
          throw new HttpException(
            {
              message: `Password reset link has sent to ${email}`,
              statusCode: HttpStatus.OK,
            },
            HttpStatus.OK,
          );
        } else {
          throw new HttpException(
            {
              message: 'Failed to send email',
              statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      });
  }
}
