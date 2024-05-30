import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Roles } from 'src/db/model/roles.model';
import { Users } from 'src/db/model/users.model';

@Module({
  imports: [
    SequelizeModule.forFeature([Roles]),
    SequelizeModule.forFeature([Users]),
  ],
  controllers: [RolesController],
  exports: [RolesService],
  providers: [RolesService],
})
export class RolesModule {}
