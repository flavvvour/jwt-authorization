const path = require('path');
const fs = require('fs').promises;
const nodemailer = require('nodemailer');
class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    try {
      const templatePath = path.resolve(
        __dirname,
        '../mail-templates/activation-mail.html'
      );

      let html = await fs.readFile(templatePath, 'utf-8');

      html = html.replace(/\{\{activationLink\}\}/g, link);

      await this.transporter.sendMail({
        from: `"JWT Auth System" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Активация аккаунта в системе авторизации',
        html,
      });
      console.log('Письмо активации отправлено:', to);
    } catch (error) {
      console.error('Ошибка отправки письма активации:', error.message);
      throw error;
    }
  }
}

module.exports = new MailService();
