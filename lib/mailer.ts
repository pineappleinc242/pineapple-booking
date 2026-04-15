const nodemailer = require('nodemailer');

interface BookingData {
  full_name: string;
  email: string;
  phone?: string;
  service: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
}

// Create transporter with reliable configuration for Outlook/Office365 or Gmail
function createTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true";

  const config = {
    host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
    port: port,
    secure: secure, // false for port 587
    // Add timeouts to prevent hanging
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: 'SSLv3', // Strongly required for Outlook/Hotmail/Office365 connections in Node
      rejectUnauthorized: false
    }
  };

  console.log('[EMAIL] Creating transporter with config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    hasAuth: !!(config.auth.user && config.auth.pass)
  });

  return nodemailer.createTransport(config);
}

const transporter = createTransporter();

export async function sendBookingEmails(booking: BookingData): Promise<void> {
  try {
    console.log('EMAIL: started')
    const { full_name, email, phone, service, booking_date, booking_time, notes } = booking;

    // Customer confirmation email
    const customerSubject = `Booking confirmed — ${service} (${booking_date} ${booking_time})`;
    const customerHtml = `
      <h2>Booking Confirmed!</h2>
      <p>Dear ${full_name},</p>
      <p>Your booking has been confirmed with the following details:</p>
      <ul>
        <li><strong>Service:</strong> ${service}</li>
        <li><strong>Date:</strong> ${booking_date}</li>
        <li><strong>Time:</strong> ${booking_time}</li>
        ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
        ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
      </ul>
      <p>Thank you for choosing Pineapple Booking!</p>
      <p>If you need to make any changes, please contact us.</p>
    `;

    const customerText = `
Booking Confirmed!

Dear ${full_name},

Your booking has been confirmed with the following details:

Service: ${service}
Date: ${booking_date}
Time: ${booking_time}
${phone ? `Phone: ${phone}\n` : ''}${notes ? `Notes: ${notes}\n` : ''}

Thank you for choosing Pineapple Booking!
If you need to make any changes, please contact us.
    `.trim();

    // Admin notification email
    const adminSubject = `New booking — ${service} (${booking_date} ${booking_time})`;
    const adminHtml = `
      <h2>New Booking Received</h2>
      <p>A new booking has been made:</p>
      <ul>
        <li><strong>Name:</strong> ${full_name}</li>
        <li><strong>Email:</strong> ${email}</li>
        ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
        <li><strong>Service:</strong> ${service}</li>
        <li><strong>Date:</strong> ${booking_date}</li>
        <li><strong>Time:</strong> ${booking_time}</li>
        ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
      </ul>
    `;

    const adminText = `
New Booking Received

A new booking has been made:

Name: ${full_name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}Service: ${service}
Date: ${booking_date}
Time: ${booking_time}
${notes ? `Notes: ${notes}\n` : ''}

Please check the admin dashboard for full details.
    `.trim();

    // Send customer email
    await transporter.sendMail({
      from: `"Pineapple Booking" <${process.env.SMTP_USER}>`,
      to: email,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    });

    // Send admin email
    if (process.env.ADMIN_EMAIL) {
      await transporter.sendMail({
        from: `"Pineapple Booking" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: adminSubject,
        text: adminText,
        html: adminHtml,
      });
    }

    console.log('EMAIL: success');

  } catch (error) {
    console.error('EMAIL: failed (' + (error instanceof Error ? error.message : 'Unknown error') + ')');
    // Don't throw - we don't want email failures to break booking creation
  }
}

export async function sendCancellationEmails(booking: BookingData): Promise<void> {
  try {
    console.log('EMAIL: started - sending cancellation emails')
    const { full_name, email, phone, service, booking_date, booking_time, notes } = booking

    const subject = `Booking Cancelled - ${service} (${booking_date} ${booking_time})`

    // Customer cancellation email
    const customerHtml = `
      <h2>Booking Cancelled</h2>
      <p>Dear ${full_name},</p>
      <p>Your booking has been cancelled:</p>
      <ul>
        <li><strong>Service:</strong> ${service}</li>
        <li><strong>Date:</strong> ${booking_date}</li>
        <li><strong>Time:</strong> ${booking_time}</li>
        ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
        ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
      </ul>
      <p>If you need to reschedule, please contact us.</p>
    `

    const customerText = `
Booking Cancelled

Dear ${full_name},

Your booking has been cancelled:

Service: ${service}
Date: ${booking_date}
Time: ${booking_time}
${phone ? `Phone: ${phone}\n` : ''}${notes ? `Notes: ${notes}\n` : ''}

If you need to reschedule, please contact us.
    `.trim()

    // Send customer email
    await transporter.sendMail({
      from: `"Pineapple Booking" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      text: customerText,
      html: customerHtml,
    })

    // Send admin notification
    if (process.env.ADMIN_EMAIL) {
      const adminHtml = `
        <h2>Booking Cancelled</h2>
        <p>A booking has been cancelled:</p>
        <ul>
          <li><strong>Name:</strong> ${full_name}</li>
          <li><strong>Email:</strong> ${email}</li>
          ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
          <li><strong>Service:</strong> ${service}</li>
          <li><strong>Date:</strong> ${booking_date}</li>
          <li><strong>Time:</strong> ${booking_time}</li>
          ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
        </ul>
      `

      const adminText = `
Booking Cancelled

A booking has been cancelled:

Name: ${full_name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}Service: ${service}
Date: ${booking_date}
Time: ${booking_time}
${notes ? `Notes: ${notes}\n` : ''}

The time slot is now available for new bookings.
      `.trim()

      await transporter.sendMail({
        from: `"Pineapple Booking" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: subject,
        text: adminText,
        html: adminHtml,
      })
    }

    console.log('EMAIL: success - cancellation emails sent')

  } catch (error) {
    console.error('EMAIL: failed (' + (error instanceof Error ? error.message : 'Unknown error') + ')')
  }
}

export async function sendBookingActionEmails(action: 'approve' | 'cancel' | 'reschedule', booking: any): Promise<void> {
  try {
    console.log(`EMAIL: started - ${action} action`)
    const { full_name, email, phone, service, booking_date, booking_time, notes, rescheduled_from_date, rescheduled_from_time } = booking;

    let customerSubject: string;
    let customerHtml: string;
    let customerText: string;
    let adminSubject: string;
    let adminHtml: string;
    let adminText: string;

    const bookingDetails = `
      <strong>Name:</strong> ${full_name}<br>
      <strong>Email:</strong> ${email}<br>
      ${phone ? `<strong>Phone:</strong> ${phone}<br>` : ''}
      <strong>Service:</strong> ${service}<br>
      <strong>Date:</strong> ${booking_date}<br>
      <strong>Time:</strong> ${booking_time}<br>
      ${notes ? `<strong>Notes:</strong> ${notes}<br>` : ''}
    `.trim();

    const bookingDetailsText = `
Name: ${full_name}
Email: ${email}
${phone ? `Phone: ${phone}\n` : ''}Service: ${service}
Date: ${booking_date}
Time: ${booking_time}
${notes ? `Notes: ${notes}\n` : ''}
    `.trim();

    if (action === 'approve') {
      customerSubject = `Booking Approved — ${service} (${booking_date} ${booking_time})`;
      customerHtml = `
        <h2>Booking Approved!</h2>
        <p>Great news! Your booking has been approved and confirmed.</p>
        <h3>Booking Details:</h3>
        <p>${bookingDetails.replace(/\n/g, '<br>')}</p>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `;
      customerText = `
Booking Approved!

Great news! Your booking has been approved and confirmed.

Booking Details:
${bookingDetailsText}

If you have any questions, please don't hesitate to contact us.
      `.trim();

      adminSubject = `Booking Approved — ${full_name} (${service})`;
      adminHtml = `
        <h2>Booking Approved</h2>
        <p>A booking has been approved:</p>
        <p>${bookingDetails.replace(/\n/g, '<br>')}</p>
      `;
      adminText = `
Booking Approved

A booking has been approved:
${bookingDetailsText}
      `.trim();

    } else if (action === 'cancel') {
      customerSubject = `Booking Cancelled — ${service} (${booking_date} ${booking_time})`;
      customerHtml = `
        <h2>Booking Cancelled</h2>
        <p>Your booking has been cancelled.</p>
        <h3>Booking Details:</h3>
        <p>${bookingDetails.replace(/\n/g, '<br>')}</p>
        <p>If you'd like to reschedule, please contact us or book a new appointment.</p>
      `;
      customerText = `
Booking Cancelled

Your booking has been cancelled.

Booking Details:
${bookingDetailsText}

If you'd like to reschedule, please contact us or book a new appointment.
      `.trim();

      adminSubject = `Booking Cancelled — ${full_name} (${service})`;
      adminHtml = `
        <h2>Booking Cancelled</h2>
        <p>A booking has been cancelled:</p>
        <p>${bookingDetails.replace(/\n/g, '<br>')}</p>
        <p>The time slot is now available for new bookings.</p>
      `;
      adminText = `
Booking Cancelled

A booking has been cancelled:
${bookingDetailsText}

The time slot is now available for new bookings.
      `.trim();

    } else if (action === 'reschedule') {
      const oldDateTime = rescheduled_from_date && rescheduled_from_time
        ? `${rescheduled_from_date} ${rescheduled_from_time}`
        : 'previous time';

      customerSubject = `Booking Rescheduled — ${service} (${booking_date} ${booking_time})`;
      customerHtml = `
        <h2>Booking Rescheduled</h2>
        <p>Your booking has been rescheduled to a new time.</p>
        <h3>Previous Time:</h3>
        <p>${oldDateTime}</p>
        <h3>New Time:</h3>
        <p>${booking_date} ${booking_time}</p>
        <h3>Booking Details:</h3>
        <p>${bookingDetails.replace(/\n/g, '<br>')}</p>
      `;
      customerText = `
Booking Rescheduled

Your booking has been rescheduled to a new time.

Previous Time: ${oldDateTime}
New Time: ${booking_date} ${booking_time}

Booking Details:
${bookingDetailsText}
      `.trim();

      adminSubject = `Booking Rescheduled — ${full_name} (${service})`;
      adminHtml = `
        <h2>Booking Rescheduled</h2>
        <p>A booking has been rescheduled:</p>
        <p><strong>From:</strong> ${oldDateTime}</p>
        <p><strong>To:</strong> ${booking_date} ${booking_time}</p>
        <p>${bookingDetails.replace(/\n/g, '<br>')}</p>
      `;
      adminText = `
Booking Rescheduled

A booking has been rescheduled:
From: ${oldDateTime}
To: ${booking_date} ${booking_time}

${bookingDetailsText}
      `.trim();
    } else {
      throw new Error(`Unknown action: ${action}`);
    }

    // Send customer email
    await transporter.sendMail({
      from: `"Pineapple Booking" <${process.env.SMTP_USER}>`,
      to: email,
      subject: customerSubject,
      text: customerText,
      html: customerHtml,
    });

    // Send admin email
    await transporter.sendMail({
      from: `"Pineapple Booking" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: adminSubject,
      text: adminText,
      html: adminHtml,
    });

    console.log(`EMAIL: success - ${action} emails sent`)

  } catch (error) {
    console.error(`EMAIL: failed - ${action} action (${error instanceof Error ? error.message : 'Unknown error'})`)
    throw error; // Re-throw to let caller handle
  }
}