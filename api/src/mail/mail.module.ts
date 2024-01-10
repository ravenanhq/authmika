import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => {
        const mailConfig = {
          transport: {
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT, 10),
            secure: false,
            auth: {},
          },
          defaults: {
            from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        };

        if (process.env.MAIL_USERNAME && process.env.MAIL_PASSWORD) {
          mailConfig.transport.auth = {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
          };
        }

        return mailConfig;
      },
    }),
    MailModule,
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
