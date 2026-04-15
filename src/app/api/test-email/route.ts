import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create setup mapped exactly to our main mailer.ts
function createTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587;
  const secure = process.env.SMTP_SECURE === "true";

  const config = {
    host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
    port: port,
    secure: secure,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    }
  };

  console.log('[TEST-EMAIL] Creating transporter with config:', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    hasAuth: !!(config.auth.user && config.auth.pass)
  });

  return nodemailer.createTransport(config);
}

export async function POST(request: NextRequest) {
  try {
    console.log('[TEST-EMAIL] Starting email test');

    // Log which env vars are present (booleans only, no secrets)
    const envStatus = {
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_SECURE: !!process.env.SMTP_SECURE,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASS: !!process.env.SMTP_PASS,
      ADMIN_EMAIL: !!process.env.ADMIN_EMAIL,
      FROM_EMAIL: !!process.env.FROM_EMAIL,
    };

    console.log('[TEST-EMAIL] Environment variables status:', envStatus);

    if (!process.env.ADMIN_EMAIL) {
      return NextResponse.json({
        success: false,
        error: 'ADMIN_EMAIL environment variable is not set'
      }, { status: 500 });
    }

    const transporter = createTransporter();

    // Test transporter connection
    console.log('[TEST-EMAIL] Verifying transporter connection...');
    const verifyResult = await transporter.verify();
    console.log('[TEST-EMAIL] Verify result:', verifyResult);

    if (!verifyResult) {
      return NextResponse.json({
        success: false,
        error: 'Transporter verification failed'
      }, { status: 500 });
    }

    console.log('[TEST-EMAIL] Transporter verified successfully');

    // Send test email
    console.log(`[TEST-EMAIL] Sending test email to ${process.env.ADMIN_EMAIL}`);
    const testResult = await transporter.sendMail({
      from: `"Pineapple Booking" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: 'PIDS Test Email',
      text: 'This is a test email from PIDS Booking system.\n\nIf you received this, email configuration is working correctly!',
      html: '<h2>PIDS Test Email</h2><p>This is a test email from PIDS Booking system.</p><p>If you received this, email configuration is working correctly!</p>'
    });

    console.log('[TEST-EMAIL] Test email sent successfully:', testResult.messageId);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      messageId: testResult.messageId
    });

  } catch (error: any) {
    console.error('[TEST-EMAIL] Test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}