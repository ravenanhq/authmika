import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { UsersCommand } from './users/users.command';
import { CommandModule } from 'nestjs-command';
import { ApplicationsCommand } from './applications/applications.command';
import { ApplicationsModule } from './applications/applications.module';
import { UserApplicationsModule } from './user-applications/user-applications.module';
import { UserApplicationCommand } from './user-applications/user-applications.command';
import { AuthClientsModule } from './auth-clients/auth-clients.module';
import { UserApplicationsController } from './user-applications/user-application.controller';
import { GroupsModule } from './groups/groups.module';
import { RolesModule } from './roles/roles.module';
import { GroupUsersModule } from './group-users/group-users.module';

dotenv.config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadModels: true,
      synchronize: false,
      logging: false,
      define: {
        underscored: true,
      },
    }),
    AuthModule,
    UsersModule,
    ApplicationsModule,
    UserApplicationsModule,
    MailModule,
    CommandModule,
    AuthClientsModule,
    GroupsModule,
    RolesModule,
    GroupUsersModule,
  ],
  controllers: [AppController, AuthController, UserApplicationsController],
  providers: [
    UsersCommand,
    ApplicationsCommand,
    UserApplicationCommand,
    AppService,
    AuthService,
    MailService,
  ],
})
export class AppModule {}
