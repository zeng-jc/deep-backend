import { Global, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Global()
@Injectable()
export class EmailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.163.com',
      secure: true,
      port: 465,
      auth: {
        user: 'coder_zjc@163.com',
        pass: 'UUXYUWVATDFTLGNC',
      },
    });
  }
  async sendMail(to: string, subject: string, text: string) {
    const mailOptions = {
      from: 'coder_zjc@163.com',
      to: to,
      subject: subject,
      text: text,
    };
    const info = await this.transporter.sendMail(mailOptions);
    return info;
  }

  async sendMailCreateUser(to: string, name: string) {
    const mailOptions = {
      from: 'coder_zjc@163.com',
      to: to,
      subject: '深谙',
      html: `
        <p>Hi~ “ <strong style="color:#165dff;">${name}</strong> ”同学，欢迎您加入深谙。<p>
      `,
    };
    const info = await this.transporter.sendMail(mailOptions);
    return info; // 返回发送结果信息
  }
}
