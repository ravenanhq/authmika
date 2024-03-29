import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../db/model/users.model';
import { UsersController } from './users.controller';
import { UserApplications } from 'src/db/model/user-applications.model';
import { UserApplicationService } from '../user-applications/user-applications.service';
import { UserApplicationsController } from '../user-applications/user-application.controller';
import { Applications } from 'src/db/model/applications.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Users]),
    SequelizeModule.forFeature([UserApplications]),
    SequelizeModule.forFeature([Applications]),
  ],
  providers: [UsersService, UserApplicationService],
  exports: [UsersService],
  controllers: [UsersController, UserApplicationsController],
})
export class UsersModule {}
