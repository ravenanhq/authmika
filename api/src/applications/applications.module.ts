import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Applications } from 'src/db/model/applications.model';
import { ApplicationsController } from './applications.controller';

@Module({
  imports: [SequelizeModule.forFeature([Applications])],
  providers: [ApplicationsService],
  exports: [ApplicationsService],
  controllers: [ApplicationsController],
})
export class ApplicationsModule {}
