import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { UserApplicationService } from '../user-applications/user-applications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Applications } from 'src/db/model/applications.model';
import { UserApplications } from 'src/db/model/user-applications.model';
import { ApplicationsController } from './applications.controller';
import { UserApplicationsController } from '../user-applications/user-application.controller';
import { Users } from 'src/db/model/users.model';
import { GroupUsers } from 'src/db/model/group-users.model';
import { Groups } from 'src/db/model/groups.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Applications,
      UserApplications,
      Users,
      GroupUsers,
      Groups,
    ]),
  ],
  providers: [ApplicationsService, UserApplicationService],
  exports: [ApplicationsService],
  controllers: [ApplicationsController, UserApplicationsController],
})
export class ApplicationsModule {}
