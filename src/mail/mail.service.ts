import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(to: string, subject: string, template: string, context: any) {
    try {
      await this.mailerService.sendMail({
        to, // Recipient email
        subject, // Subject
        template, // Template file (if using handlebars, pug, etc.)
        context, // Data to inject into the template
      });
      return { message: 'success' };
    } catch (error) {
      console.error('Error sending email:', error.message);
      throw error;
    }
  }
}
