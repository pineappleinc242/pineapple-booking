const nodemailer = require('nodemailer');

async function test() {
  console.log("Testing Outlook Auth again...");
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: 'pineappleincstudios@outlook.com',
      pass: 'eopmdosxcrsnfdbt',
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
    console.log("Connection verified! Outlook is accepting the connection.");
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

test();
