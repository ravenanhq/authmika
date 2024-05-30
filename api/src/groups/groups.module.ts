import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Groups } from 'src/db/model/groups.model';

@Module({
  imports: [SequelizeModule.forFeature([Groups])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
