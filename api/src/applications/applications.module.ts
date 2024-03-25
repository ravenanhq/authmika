import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { UserApplicationService } from '../user-applications/user-applications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Applications } from 'src/db/model/applications.model';
import { UserApplications } from 'src/db/model/user-applications.model';
import { ApplicationsController } from './applications.controller';
import { UserApplicationsController } from '../user-applications/user-application.controller';

@Module({
  imports: [
    SequelizeModule.forFeature([Applications]),
    SequelizeModule.forFeature([UserApplications]),
  ],
  providers: [ApplicationsService, UserApplicationService],
  exports: [ApplicationsService],
  controllers: [ApplicationsController, UserApplicationsController],
})
export class ApplicationsModule {}
