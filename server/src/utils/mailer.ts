// utils/mailer.ts

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'hotmail', 'outlook', or custom SMTP
  auth: {
    user: process.env.SMTP_USER,     // your email address
    pass: process.env.SMTP_PASS,     // your email password or app password
  },
});

export const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"MediaHub" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent: %s', info.messageId);
    return info;
  } catch (err) {
    console.error('Error sending email:', err);
    throw new Error('Failed to send email');
  }
};
