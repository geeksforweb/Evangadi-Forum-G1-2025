require("dotenv").config();
// nodemailer Uses Gmail to send emails
const nodemailer = require("nodemailer");

// transporter knows HOW to send emails and FROM WHERE.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(" Email sent to:", to, "Response:", info.response);
    return true;
  } catch (err) {
    console.error(" Error sending email:", err.message);
    return false; // Won’t crash backend
  }
};

module.exports = sendEmail;
