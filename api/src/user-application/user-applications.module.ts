import { Module } from '@nestjs/common';
import { UserApplicationService } from './user-applications.service';
import { UserApplications } from 'src/db/model/user-applications.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([UserApplications])],
  providers: [UserApplicationService],
  exports: [UserApplicationService],
})
export class UserApplicationsModule {}
