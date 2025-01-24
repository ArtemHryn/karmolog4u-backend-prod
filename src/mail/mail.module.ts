import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get<string>('MAIL_HOST'), // SMTP server
          port: config.get<number>('MAIL_PORT'), // SMTP port
          auth: {
            user: config.get<string>('MAIL_USER'), // SMTP user
            pass: config.get<string>('MAIL_PASSWORD'), // SMTP password
          },
        },
        defaults: {
          from: `"No Reply" <${config.get<string>('MAIL_FROM')}>`, // Default sender address
        },
        template: {
          dir: '/src/common/mailTemplates', // Directory for templates
          adapter: new HandlebarsAdapter(),
          options: { strict: true },
        },
      }),
    }),
    ConfigModule, // Ensure ConfigModule is imported
  ],
  providers: [MailService],
  exports: [MailService], // Export the service for use in other modules
})
export class MailModule {}
