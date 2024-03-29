import { Global, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { emailConfig, emailFrom } from './email.config';

@Global()
@Injectable()
export class EmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport(emailConfig);
  }
  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: emailFrom,
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

  async sendMailCreateUserNotify(to: string, name: string) {
    const mailOptions = {
      from: emailFrom,
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
      return false;
    }
  }

  async sendMailVerifyCode(to: string, text: string) {
    const mailOptions = {
      from: emailFrom,
      to: to,
      subject: '深谙',
      html: `
        <p>您的验证码是：“ <strong style="color:#165dff;">${text}</strong> ，有效时间为3分钟”<p>
      `,
    };
    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // TODO
      console.log('邮箱发送失败');
      return false;
    }
  }
}
