import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import * as dotenv from 'dotenv';
import { AuthController } from './auth/controllers/auth.controller';
import { AuthService } from './auth/services/auth.service';
import { AuthModule } from './auth/auth.module';

dotenv.config();

@Module({
	imports: [
		SequelizeModule.forRoot({
			dialect: 'mysql',
			host: process.env.DB_HOST,
			port: parseInt(process.env.DB_PORT, 10),
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE,
			autoLoadModels: true,
			synchronize: true,
			define: {
				underscored: true,
			},
		}),
		AuthModule,
		UsersModule
	],
	controllers: [AppController, AuthController],
	providers: [AppService, AuthService],
})
export class AppModule {}
