import { Module } from '@nestjs/common';
import { UserApplicationService } from './user-applications.service';
import { UserApplications } from 'src/db/model/user-applications.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserApplicationsController } from './user-application.controller';
import { Applications } from 'src/db/model/applications.model';
@Module({
  imports: [SequelizeModule.forFeature([UserApplications, Applications])],
  providers: [UserApplicationService],
  exports: [UserApplicationService],
  controllers: [UserApplicationsController],
})
export class UserApplicationsModule {}
