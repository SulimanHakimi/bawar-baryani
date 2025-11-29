import nodemailer from 'nodemailer';

// Check if SMTP is properly configured
const isSmtpConfigured = () => {
  return process.env.SMTP_HOST && 
         process.env.SMTP_HOST !== 'smtp.example.com' &&
         process.env.SMTP_USER && 
         process.env.SMTP_PASS;
};

let transporter = null;

// Only create transporter if SMTP is configured
if (isSmtpConfigured()) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export const sendEmail = async ({ to, subject, text, html }) => {
  // Skip if SMTP not configured
  if (!isSmtpConfigured()) {
    console.warn('⚠️  SMTP not configured. Email not sent. Please configure SMTP settings in .env.local');
    console.warn(`   Would have sent email to: ${to}`);
    console.warn(`   Subject: ${subject}`);
    return { skipped: true, reason: 'SMTP not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Bawar Biryani" <no-reply@bawarbiryani.com>',
      to,
      subject,
      text,
      html,
    });
    console.log('✅ Email sent successfully: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    // Don't throw error to avoid breaking the main flow if email fails
    return { error: error.message };
  }
};
