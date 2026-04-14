import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendEmail = async (options) => {
  try {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD, // App password if using Gmail
      },
    });

    // 2) Define the email options
    const mailOptions = {
      from: `Blood Bank Management System <${process.env.EMAIL_USERNAME}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html, // Optional: for HTML formatted emails
    };

    // 3) Actually send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email successfully sent to ${options.email}`);
  } catch (error) {
    console.error(`Failed to send email to ${options.email}:`, error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
