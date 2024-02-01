import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendVerificationEmail(
    firstName: string,
    userEmail: string,
    verificationToken: string,
  ) {
    const url =
      process.env.BASE_URL + '/verify-email?token=' + verificationToken;

    const mailOptions = {
      to: userEmail,
      subject: 'Email Verification',
      template: 'email-verification',
      context: {
        name: firstName,
        verificationTokenUrl: url,
      },
    };

    try {
      return await this.mailerService.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  }

  async sendForgotPasswordEmail(email: string, url: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Forgot Password - Authmika',
        template: './forgot-password',
        context: {
          email: email,
          url: url,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
