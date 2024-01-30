import { Module } from '@nestjs/common';
import { AuthClientsService } from './auth-clients.service';
import { AuthClients } from 'src/db/model/auth-clients.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([AuthClients])],
  providers: [AuthClientsService],
  exports: [AuthClientsService],
})
export class AuthClientsModule {}
