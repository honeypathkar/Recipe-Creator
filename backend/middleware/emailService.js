const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is: ${otp}. It expires in 10 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent!");
  } catch (error) {
    console.error("Error sending OTP email", error);
  }
};

module.exports = { sendOtpEmail };
