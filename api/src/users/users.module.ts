import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from '../db/model/users.model';
import { UsersController } from './users.controller';

@Module({
  imports: [SequelizeModule.forFeature([Users])],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
