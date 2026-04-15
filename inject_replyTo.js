const fs = require('fs');

const mailerPath = './lib/mailer.ts';
let content = fs.readFileSync(mailerPath, 'utf8');

// Add replyTo to customer email inside sendBookingEmails
content = content.replace(
`    // Send customer email
    await transporter.sendMail({
      from: \`"Pineapple Booking" <\${process.env.SMTP_USER}>\`,
      to: email,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    });`,
`    // Send customer email
    await transporter.sendMail({
      from: \`"Pineapple Booking" <\${process.env.SMTP_USER}>\`,
      replyTo: process.env.ADMIN_EMAIL, // Route replies back to business Outlook
      to: email,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    });`);

// Do the same for Cancellation emails
content = content.replace(
`    // Send customer email
    await transporter.sendMail({
      from: \`"Pineapple Booking" <\${process.env.SMTP_USER}>\`,
      to: email,
      subject: subject,
      text: customerText,
      html: customerHtml,
    })`,
`    // Send customer email
    await transporter.sendMail({
      from: \`"Pineapple Booking" <\${process.env.SMTP_USER}>\`,
      replyTo: process.env.ADMIN_EMAIL, // Route replies back to business Outlook
      to: email,
      subject: subject,
      text: customerText,
      html: customerHtml,
    })`);

// Do the same for Action emails (approve, cancel, reschedule)
content = content.replace(
`    // Send customer email
    await transporter.sendMail({
      from: \`"Pineapple Booking" <\${process.env.SMTP_USER}>\`,
      to: email,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    });`,
`    // Send customer email
    await transporter.sendMail({
      from: \`"Pineapple Booking" <\${process.env.SMTP_USER}>\`,
      replyTo: process.env.ADMIN_EMAIL, // Route replies back to business Outlook
      to: email,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    });`);

fs.writeFileSync(mailerPath, content);
console.log("Updated mailer.ts to include replyTo headers!");
