import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthClients } from 'src/db/model/auth-clients.model';
import { Applications } from 'src/db/model/applications.model';
import { UserApplications } from 'src/db/model/user-applications.model';
import * as jwt from 'jsonwebtoken';
import { Users } from 'src/db/model/users.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(username: string, pass: string, clientId: string) {
    let apiToken = '';
    const user = await this.usersService.findUsername(username);
    if (!user || !(await bcrypt.compare(pass, user?.password))) {
      throw new UnauthorizedException('Incorrect username or password.');
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
        throw new UnauthorizedException('Application not found.');
      }

      const userApplication = await UserApplications.findOne({
        where: { userId: user.dataValues.id, applicationId: application.id },
      });

      if (!userApplication) {
        throw new UnauthorizedException('Access denied.');
      }

      const userdetails = {
        id: user.id,
        username: user.userName,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
      };

      // Create the JWT token with user details as payload
      apiToken = jwt.sign(userdetails, application.clientSecretKey, {
        expiresIn: process.env.JWT_EXPIRATION,
        algorithm: 'HS256',
      });
    }

    const payload = { sub: user.id, username: user.userName };
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
        username: user.userName,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        clientSecretId: application.clientSecretId,
        clientSecretKey: application.clientSecretKey
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
