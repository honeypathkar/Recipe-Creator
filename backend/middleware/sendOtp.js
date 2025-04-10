const nodemailer = require("nodemailer"); // Make sure nodemailer is required
require("dotenv").config();

// Function to generate and send OTP
async function sendOtp(user) {
  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Save OTP and expiry to user object
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save(); // Save the updated user object with OTP details

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.APP_PASS,
      },
    });

    // Define email options
    const mailOptions = {
      from: `"Recipe Creator" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your OTP Code for Recipe Creator Verification", // Subject can be more general
      text: `Your OTP is ${otp}. This will expire in 10 minutes.`,
      html: `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background-color: #f8f9fa; }
            .container { max-width: 500px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            h2 { color: #333; }
            .otp { font-size: 28px; font-weight: bold; color: #28a745; margin: 10px 0; text-align: center; display: flex; justify-content: center; align-items: center; }
            .footer { margin-top: 20px; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Your OTP Code</h2>
            <p>Your OTP for authentication of your Recipe Creator account is:</p>
            <div class="otp">${otp}</div>
            <p>This code expires in 10 minutes. Please use this OTP to securely log in or verify your account.</p>
            <div class="footer">
              If you did not request this OTP, please ignore this email.
            </div>
          </div>
        </body>
      </html>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`OTP sent successfully to ${user.email}`);
    return true; // Indicate success
  } catch (error) {
    console.error(`Error sending OTP to ${user.email}:`, error);
    // Re-throw the error so the calling function knows something went wrong
    throw new Error("Failed to send OTP email.");
  }
}

module.exports = sendOtp; // Export the function for use in other modules
