const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function test() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'pineappleinc242@gmail.com',
      pass: 'agaaueylvlturgcw', 
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"Pineapple Booking" <pineappleinc242@gmail.com>`, // Must be the authenticated user
      replyTo: 'pineappleincstudios@outlook.com', // Replies go to the client's Outlook
      to: 'pineappleincstudios@outlook.com', // Send to client as a test
      subject: "Test Booking from Website",
      text: "This email was sent via Gmail but replies will go to Outlook.",
    });
    console.log("Success! Message ID:", info.messageId);
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
