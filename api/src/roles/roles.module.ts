import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Roles } from 'src/db/model/roles.model';

@Module({
  imports: [SequelizeModule.forFeature([Roles])],
  controllers: [RolesController],
  exports: [RolesService],
  providers: [RolesService],
})
export class RolesModule {}
