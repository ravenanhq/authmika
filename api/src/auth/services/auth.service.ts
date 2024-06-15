import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthClients } from 'src/db/model/auth-clients.model';
import { Applications } from 'src/db/model/applications.model';
import { UserApplications } from 'src/db/model/user-applications.model';
import * as jwt from 'jsonwebtoken';
import { Users } from 'src/db/model/users.model';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn(username: string, pass: string, clientId: string) {
    let apiToken = '';
    const user = await this.usersService.findEmail(username);
    if (
      !user ||
      !(await bcrypt.compare(pass, user?.password)) ||
      user.status != 1
    ) {
      throw new UnauthorizedException('Incorrect email or password.');
    }

    if (clientId) {
      const clientModel = await AuthClients.findOne({
        where: { id: clientId },
      });

      const application = await Applications.findOne({
        where: {
          clientSecretId: clientModel.clientSecretId,
          clientSecretKey: clientModel.clientSecretKey,
        },
      });

      if (!application) {
        throw new NotFoundException('Application not found.');
      }

      const userApplication = await UserApplications.findOne({
        where: { userId: user.dataValues.id, applicationId: application.id },
      });

      if (!userApplication) {
        throw new UnauthorizedException('Access denied.');
      }

      const userdetails = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      };

      // Create the JWT token with user details as payload
      apiToken = jwt.sign(userdetails, application.clientSecretKey, {
        expiresIn: process.env.JWT_EXPIRATION,
        algorithm: 'HS256',
      });
    } else if (user.isTwoFactorEnabled) {
      const otp = Math.floor(Math.random() * 900000) + 100000;
      const expiresTime = parseInt(process.env.OTP_EXPIRATION);
      const expirationTimestamp = Date.now() + expiresTime * 60 * 1000;
      user.otp = otp;
      user.otp_expiration = expirationTimestamp;
      await user.save();

      const url = `${process.env.BASE_URL}/login`;
      await this.mailService.sendOtpByEmail(
        user.email,
        otp,
        user.firstName,
        user.lastName,
        url,
      );
    }

    const payload = { sub: user.id, firstName: user.firstName };
    return {
      access_token: await this.jwtService.signAsync(payload),
      token_type: 'Bearer',
      user: user,
      apiToken: apiToken,
    };
  }

  async quickSignIn(userId: number, applicationId: number) {
    let apiToken = '';
    const user = await Users.findOne({
      where: { id: userId },
    });
    const application = await Applications.findOne({
      where: { id: applicationId },
    });

    const isUserHasAccess = await UserApplications.findOne({
      where: { user_id: userId, application_id: applicationId },
    });

    if (user && application) {
      const userdetails = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        clientSecretId: application.clientSecretId,
        clientSecretKey: application.clientSecretKey,
      };

      apiToken = jwt.sign(userdetails, application.clientSecretKey, {
        expiresIn: process.env.JWT_EXPIRATION,
        algorithm: 'HS256',
      });
    }

    if (apiToken && isUserHasAccess) {
      return {
        statusCode: HttpStatus.OK,
        callBackUrl: application.callBackUrl,
        apiToken: apiToken,
      };
    } else {
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message:
          'You are already logged in. Please log out first and then log in with your account.',
      };
    }
  }
}
