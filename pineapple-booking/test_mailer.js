require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function test() {
  console.log("User:", process.env.SMTP_USER);
  console.log("Pass length:", process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    },
    debug: true,
    logger: true
  });

  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("Connection verified!");
    
    const info = await transporter.sendMail({
      from: `"Test" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: "Test email",
      text: "Hello world"
    });
    console.log("Email sent!", info.messageId);
  } catch (err) {
    console.error("Failed:", err);
  }
}

test();
