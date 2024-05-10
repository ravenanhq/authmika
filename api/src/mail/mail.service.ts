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

  async sendCreatePasswordEmail(
    email: string,
    url: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Create Password - Authmika',
        template: './create-password',
        context: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          url: url,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async sendForgotPasswordEmail(
    email: string,
    url: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Forgot Password - Authmika',
        template: './forgot-password',
        context: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          url: url,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async sendOtpByEmail(
    email: string,
    otp: number,
    firstName: string,
    lastName: string,
    url: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'One Time Password (OTP) - AUTHMIKA',
        template: './otp-email-template',
        context: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          otp: otp,
          url: url,
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  async sendUserActivationEmail(
    email: string,
    url: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'User Activation - Authmika',
        template: './user-activation',
        context: {
          email: email,
          firstName: firstName,
          lastName: lastName,
          url: url,
        },
      });
      return true;
    } catch {
      return false;
    }
  }
}
