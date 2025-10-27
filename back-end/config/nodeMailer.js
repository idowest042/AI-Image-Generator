// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: {
      name: "Imagine AI Support",
      address: process.env.EMAIL_USERNAME
    },
    to: email,
    subject: "✅ Verify Your Imagine AI Account",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f4f6f8;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            background-color: #ffffff;
            margin: 40px auto;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.1);
          }
          .logo {
            text-align: center;
            margin-bottom: 20px;
          }
          .logo h1 {
            color: #2b2b2b;
            font-size: 24px;
          }
          .header {
            text-align: center;
            color: #333333;
            font-size: 22px;
            font-weight: 600;
            margin-bottom: 10px;
          }
          .message {
            color: #555555;
            font-size: 16px;
            text-align: center;
            margin-bottom: 20px;
          }
          .code-box {
            background-color: #f0f4ff;
            color: #2b4eff;
            font-size: 28px;
            font-weight: bold;
            letter-spacing: 4px;
            text-align: center;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            font-size: 13px;
            color: #888888;
            margin-top: 30px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <h1>Imagine AI</h1>
          </div>
          <div class="header">Verify Your Email Address</div>
          <div class="message">
            Hi there 👋,<br />
            Thank you for signing up with <b>Imagine AI</b>! To complete your registration,
            please use the verification code below. It’s valid for the next <b>10 minutes</b>.
          </div>
          <div class="code-box">${code}</div>
          <div class="message">
            If you didn’t request this, please ignore this email.
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} Imagine AI. All rights reserved.<br />
            This is an automated message — please do not reply.
          </div>
        </div>
      </body>
      </html>
    `
  };

  await transporter.sendMail(mailOptions);
};
