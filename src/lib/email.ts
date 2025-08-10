import { createTransport } from "nodemailer";
import type { Transporter } from "nodemailer";

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

export default class Email {
    private static transporter: Transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    public static async sendOTP(options: {
        to: string;
        name: string;
        otp: string;
        subject?: string;
    }) {
        const html = `
      <!DOCTYPE html>
      <html lang="en" >
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Your OTP Code</title>
      <style>
          body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f4f6f8;
          margin: 0;
          padding: 0;
          color: #333333;
          }
          .container {
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          padding: 30px;
          text-align: center;
          }
          h1 {
          color: #2F80ED;
          margin-bottom: 20px;
          }
          p {
          font-size: 16px;
          line-height: 1.5;
          }
          .otp {
          margin: 30px 0;
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 8px;
          color: #2F80ED;
          background: #e0e7ff;
          padding: 15px 25px;
          border-radius: 8px;
          display: inline-block;
          user-select: all;
          }
          .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #999999;
          text-align: center;
          }
          @media only screen and (max-width: 620px) {
          .container {
              margin: 20px 15px;
              padding: 20px;
          }
          h1 {
              font-size: 24px;
          }
          .otp {
              font-size: 28px;
              letter-spacing: 6px;
          }
          }
      </style>
      </head>
      <body>
      <div class="container">
          <h1>Hello, ${options.name}!</h1>
          <p>Your One-Time Password (OTP) is below. Use it to complete your action:</p>
          <div class="otp">${options.otp}</div>
          <p>If you didn't request this, please ignore this email.</p>
          <p class="footer">© 2025 My App. All rights reserved.</p>
      </div>
      </body>
      </html>
    `;

        const subject = options.subject ?? "Your OTP Code for My App"

        // Kirim email dengan html dan fallback text
        await this.send({
            to: options.to,
            subject,
            html,
            text: `Hello, ${options.name}!\nYour One-Time Password (OTP) is: ${options.otp}\nIf you didn't request this, please ignore this email.`,
        });
    }

    static async send({ to, subject, html, text }: EmailOptions) {
        const mailOptions = {
            from: `"MyApp" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            text,
        };

        try {
            const info = await Email.transporter.sendMail(mailOptions);
            console.log("Email sent:", info.messageId);
            return info;
        } catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
}
