import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
  console.log('Testing with user:', process.env.SMTP_USER);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"POG Events" <${process.env.SMTP_USER}>`,
    to: 'banksymir@gmail.com',
    subject: 'Test Email from POG Backend',
    text: 'If you receive this, the SMTP configuration is perfectly fine!',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Success! Email sent:', info.response);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

testEmail();
