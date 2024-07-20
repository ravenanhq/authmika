import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../db/model/users.model';
import { UsersController } from './users.controller';
import { UserApplications } from 'src/db/model/user-applications.model';
import { UserApplicationService } from '../user-applications/user-applications.service';
import { UserApplicationsController } from '../user-applications/user-application.controller';
import { Applications } from 'src/db/model/applications.model';
import { PasswordResetTokens } from 'src/db/model/password-reset-tokens.model';
import { MailService } from 'src/mail/mail.service';
import { Roles } from 'src/db/model/roles.model';
import { GroupUsers } from 'src/db/model/group-users.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
    SequelizeModule.forFeature([UserApplications]),
    SequelizeModule.forFeature([Applications]),
    SequelizeModule.forFeature([Roles]),
    SequelizeModule.forFeature([GroupUsers]),
    SequelizeModule.forFeature([PasswordResetTokens]),
  ],
  providers: [UsersService, UserApplicationService, MailService],
  exports: [UsersService],
  controllers: [UsersController, UserApplicationsController],
})
export class UsersModule {}
