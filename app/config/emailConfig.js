require('dotenv').config();
const nodemailer = require('nodemailer');


// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.ethereal.email",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || "sudipkumarbose8@gmail.com",
    pass: process.env.EMAIL_PASS || "bzdm objs kdwx vhxg",
  },
});

module.exports = transporter