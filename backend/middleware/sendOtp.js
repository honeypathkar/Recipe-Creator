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
      service: "Gmail", // Or your preferred email service
      auth: {
        user: process.env.EMAIL_USER, // Use environment variables
        pass: process.env.APP_PASS, // Ensure this is your App Password if using Gmail
      },
    });

    const currentYear = new Date().getFullYear(); // Get current year for footer

    // Define email options with enhanced HTML template
    const mailOptions = {
      from: `"Recipe Creator" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Your Recipe Creator Verification Code", // Slightly refined subject
      text: `Your OTP for Recipe Creator is ${otp}. This code expires in 10 minutes.`, // Plain text fallback
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Recipe Creator OTP</title>
        <style>
          /* Basic Reset */
          body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
          img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
          body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f4f4; font-family: Arial, sans-serif; }
          a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
          }

          /* Main Styles */
          .wrapper {
            width: 100%;
            background-color: #f4f4f4;
          }
          .container {
            display: block;
            margin: 0 auto !important;
            max-width: 600px;
            padding: 10px;
            width: 100%; /* Fallback for Outlook */
            width: 600px; /* Force width for certain clients */
          }
          .content {
            box-sizing: border-box;
            display: block;
            margin: 0 auto;
            max-width: 600px;
            padding: 10px;
            background-color: #ffffff;
            border-radius: 8px;
            border: 1px solid #e9e9e9;
          }
          .header {
            background-color: #4CAF50; /* A green theme for recipes */
            color: #ffffff;
            padding: 20px;
            text-align: center;
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
          }
           .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: bold;
           }
          .main {
            padding: 30px;
            color: #333333;
            line-height: 1.6;
          }
          .otp-container {
            text-align: center;
            margin: 25px 0;
          }
          .otp-code {
            background-color: #e8f5e9; /* Light green background */
            border: 1px dashed #4CAF50;
            color: #388E3C; /* Darker green text */
            display: inline-block;
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 3px;
            padding: 15px 30px;
            border-radius: 5px;
            margin: 10px 0;
            font-family: 'Courier New', Courier, monospace; /* Monospaced font for code */
          }
          .footer {
            clear: both;
            padding: 20px;
            text-align: center;
            width: 100%;
            font-size: 12px;
            color: #999999;
             background-color: #f9f9f9;
             border-bottom-left-radius: 8px;
             border-bottom-right-radius: 8px;
          }
          .footer p {
            margin: 0 0 10px 0;
          }
          /* Responsive Styles */
          @media only screen and (max-width: 620px) {
            table[class=body] .container {
              width: 100% !important;
              max-width: 100% !important;
            }
            table[class=body] .content {
              padding: 10px !important;
            }
            table[class=body] .main {
              padding: 20px !important;
            }
             table[class=body] .header {
              padding: 15px !important;
             }
             table[class=body] .header h1 {
              font-size: 20px !important;
             }
             table[class=body] .otp-code {
              font-size: 28px !important;
              padding: 10px 20px !important;
             }
             table[class=body] .footer {
               padding: 15px !important;
             }
          }
        </style>
      </head>
      <body>
        <table border="0" cellpadding="0" cellspacing="0" class="wrapper" style="width: 100%; background-color: #f4f4f4;">
          <tr>
            <td align="center">
              <div class="container" style="display: block; margin: 0 auto !important; max-width: 600px; padding: 10px;">
                <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0; background-color: #ffffff; border-radius: 8px; border: 1px solid #e9e9e9;">

                  <div class="header" style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                    <h1 style="margin: 0; font-size: 24px; font-weight: bold; color: #ffffff; font-family: Arial, sans-serif;">Recipe Creator</h1>
                  </div>
                  <div class="main" style="padding: 30px; color: #333333; line-height: 1.6; font-family: Arial, sans-serif; font-size: 14px;">
                    <p style="margin: 0 0 15px 0;">Hi there,</p>
                    <p style="margin: 0 0 15px 0;">Here is your One-Time Password (OTP) for verifying your Recipe Creator account. Please enter this code to proceed:</p>

                    <div class="otp-container" style="text-align: center; margin: 25px 0;">
                      <span class="otp-code" style="background-color: #e8f5e9; border: 1px dashed #4CAF50; color: #388E3C; display: inline-block; font-size: 32px; font-weight: bold; letter-spacing: 3px; padding: 15px 30px; border-radius: 5px; margin: 10px 0; font-family: 'Courier New', Courier, monospace;">${otp}</span>
                    </div>

                    <p style="margin: 0 0 15px 0;">This code is valid for <strong>10 minutes</strong>. For your security, please do not share this code with anyone.</p>
                    <p style="margin: 0;">If you didn't request this code, you can safely ignore this email.</p>
                  </div>
                  <div class="footer" style="clear: both; padding: 20px; text-align: center; width: 100%; font-size: 12px; color: #999999; background-color: #f9f9f9; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; box-sizing: border-box;">
                    <p style="margin: 0 0 10px 0; font-family: Arial, sans-serif;">&copy; ${currentYear} Recipe Creator. All rights reserved.</p>
                    </div>
                  </div>
              </div>
              </td>
          </tr>
        </table>
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
