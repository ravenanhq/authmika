import { Module } from '@nestjs/common';
import { GroupUsersController } from './group-users.controller';
import { GroupUsersService } from './group-users.service';
import { GroupUsers } from 'src/db/model/group-users.model';
import { Users } from 'src/db/model/users.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserApplications } from 'src/db/model/user-applications.model';

@Module({
  imports: [
    SequelizeModule.forFeature([GroupUsers]),
    SequelizeModule.forFeature([Users]),
    SequelizeModule.forFeature([UserApplications]),
  ],
  providers: [GroupUsersService],
  exports: [GroupUsersService],
  controllers: [GroupUsersController],
})
export class GroupUsersModule {}
