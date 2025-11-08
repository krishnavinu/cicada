const sendMail = require('../config/Nodemailer');

// Simplified email sending (without AI for faster performance)
const sendSimpleEmail = async (to, subject, html) => {
  try {
    await sendMail(to, subject, html);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendSimpleEmail
};

