import { Module } from '@nestjs/common';
import { UserApplicationService } from './user-applications.service';
import { UserApplications } from 'src/db/model/user-applications.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserApplicationsController } from './user-application.controller';
import { ApplicationsService } from 'src/applications/applications.service';
import { ApplicationsController } from 'src/applications/applications.controller';
import { Applications } from 'src/db/model/applications.model';

@Module({
  imports: [
    SequelizeModule.forFeature([UserApplications]),
    SequelizeModule.forFeature([Applications]),
  ],
  providers: [UserApplicationService, ApplicationsService],
  exports: [UserApplicationService],
  controllers: [UserApplicationsController, ApplicationsController],
})
export class UserApplicationsModule {}
