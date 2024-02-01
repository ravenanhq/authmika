import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { ForgotPasswordController } from './controllers/forgot-password.controller';
import { ForgotPasswordService } from './services/forgot-password.service';
import { MailModule } from 'src/mail/mail.module';
import { PasswordResetTokens } from 'src/db/model/password-reset-tokens.model';
import { Users } from 'src/db/model/users.model';
import { AuthClients } from 'src/db/model/auth-clients.model';
import { Applications } from 'src/db/model/applications.model';
import { UserApplications } from 'src/db/model/user-applications.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ResetPasswordController } from './controllers/reset-password.controller';
import { ResetPasswordService } from './services/reset-password.service';
import * as dotenv from 'dotenv';
import { AuthClientsController } from 'src/auth-clients/auth-clients.controller';
import { AuthClientsService } from 'src/auth-clients/auth-clients.service';
import { ApplicationsService } from 'src/applications/applications.service';
import { UserApplicationService } from 'src/user-application/user-applications.service';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
    UsersModule,
    MailModule,
    SequelizeModule.forFeature([
      PasswordResetTokens,
      Users,
      Applications,
      UserApplications,
      AuthClients,
    ]),
  ],
  controllers: [
    AuthController,
    ForgotPasswordController,
    ResetPasswordController,
    AuthClientsController,
  ],
  providers: [
    AuthService,
    ForgotPasswordService,
    ResetPasswordService,
    ApplicationsService,
    UserApplicationService,
    AuthClientsService,
  ],
})
export class AuthModule {}
