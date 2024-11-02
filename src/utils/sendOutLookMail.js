const nodemailer = require('nodemailer');

async function sendEmail( from, appPassword, to, cc, bcc, subject, text, attachments ) {
  // Create a transporter object using Outlook SMTP configuration
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587, // Port for TLS
    secure: false, // Use TLS
    auth: {
      user: from, // Replace with your Outlook email
      pass: appPassword // Replace with your Outlook email password
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  // Define email options
  const mailOptions = {
    from: from, // Sender address
    to: to || undefined, // Primary recipient(s)
    cc: cc || undefined, // CC recipient(s) (optional)
    bcc: bcc || undefined, // BCC recipient(s) (optional)
    subject: subject || undefined,
    text: text,
    attachments: attachments || undefined
    // html: '<p>Hello, this is a test email sent from Node.js using <strong>Outlook SMTP</strong>.</p>'
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
};
