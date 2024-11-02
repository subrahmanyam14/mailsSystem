const { ModifiedPathsSnapshot } = require('mongoose');
const nodemailer = require('nodemailer');

async function sendEmail(from, appPassword, to, cc, bcc, subject, text, attachments) {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: from,
      pass: appPassword
    }
  });

  // Define mail options, only include non-empty fields
  const mailOptions = {
    from: from,
    to: to || undefined,
    cc: cc || undefined,
    bcc: bcc || undefined,
    subject: subject || undefined,
    attachments: attachments || undefined,
    text: text,
  };

  try {
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}



module.exports = {
  sendEmail
}