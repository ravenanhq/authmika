import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Groups } from 'src/db/model/groups.model';
import { GroupUsers } from 'src/db/model/group-users.model';
import { UserApplications } from 'src/db/model/user-applications.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Groups]),
    SequelizeModule.forFeature([GroupUsers]),
    SequelizeModule.forFeature([UserApplications]),
  ],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
