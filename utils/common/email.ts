'use server';
import nodemailer from "nodemailer";

const SMTP_SERVER_HOST = process.env.SMTP_SERVER_HOST;
const SMTP_SERVER_USERNAME = process.env.SMTP_SERVER_USERNAME;
const SMTP_SERVER_PASSWORD = process.env.SMTP_SERVER_PASSWORD;
const SITE_MAIL_RECIEVER = process.env.SITE_MAIL_RECIEVER;
const transporter = nodemailer.createTransport({
  service: 'mail.firdgroup.com',
  host: SMTP_SERVER_HOST,
  port: 465,
  secure: true,
  auth: {
    user: SMTP_SERVER_USERNAME,
    pass: SMTP_SERVER_PASSWORD,
  },
});

export interface EmailTemplateVariables {
  title: string;
  message: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  note?: string;
  paypalEmail?: string;
  status?: string;
  amount?: string;
  type?: string;
  currency?: string;
}

export async function sendMail({
  email,
  sendTo,
  subject,
  text,
  html,
  replacement,
  template,
}: {
  email?: string;
  sendTo: string[];
  subject: string;
  text?: string;
  html?: string;
  replacement: EmailTemplateVariables;
  template: string;
}) {
  try {
    const isVerified = await transporter.verify();
  } catch (error) {
    console.error('Something Went Wrong', SMTP_SERVER_USERNAME, SMTP_SERVER_PASSWORD, error);
    return;
  }

  function replaceTemplateVariables(template: string, variables: EmailTemplateVariables): string {
    // Use a regular expression to find and replace all {{key}} placeholders with corresponding values
    return template.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      const trimmedKey = key.trim();
      // Replace with the value from variables or an empty string if not available
      return variables[trimmedKey as keyof EmailTemplateVariables] ?? "N/A";
    });
  }
  
  const populatedHTML = replaceTemplateVariables(template, replacement);

  const info = await transporter.sendMail({
    from: `Nonton <${SMTP_SERVER_USERNAME}>`,
    bcc: sendTo.join(';') || SITE_MAIL_RECIEVER,
    subject: subject,
    text: text,
    html: html ? html : populatedHTML,
  });
  console.log('Message Sent', info.messageId);
  console.log('Mail sent to', sendTo.join(';') || SITE_MAIL_RECIEVER);
  return info;
}