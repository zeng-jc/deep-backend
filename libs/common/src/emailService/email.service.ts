import { Global, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { EMAIL_CONFIG, EMAIL_FROM } from './email.config';

@Global()
@Injectable()
export class EmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport(EMAIL_CONFIG);
  }
  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: EMAIL_FROM,
      to: to,
      subject: subject,
      text: text,
    };
    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // TODO
      console.log('邮箱发送失败');
    }
  }

  async sendMailCreateUser(to: string, name: string) {
    const mailOptions = {
      from: EMAIL_FROM,
      to: to,
      subject: '深谙',
      html: `
        <p>Hi~ “ <strong style="color:#165dff;">${name}</strong> ”同学，欢迎您加入深谙。<p>
      `,
    };
    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // TODO
      console.log('邮箱发送失败');
    }
  }
}
