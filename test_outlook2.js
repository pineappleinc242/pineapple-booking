const nodemailer = require('nodemailer');

async function test() {
  console.log("Starting...");
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
    },
    debug: true,
    logger: true
  });

  try {
    console.log("Verifying Outlook connection...");
    await transporter.verify();
    console.log("Connection verified!");
  } catch (err) {
    console.error("Failed:", err.message);
  }
}

test();
