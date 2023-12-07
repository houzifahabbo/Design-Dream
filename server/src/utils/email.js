require("dotenv").config();
const nodemailer = require("nodemailer");

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

// Function to send an email
const sendEmail = async (to, subject, text) => {
  try {
    // email options
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      html: text,
    };

    // next line tries to send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
