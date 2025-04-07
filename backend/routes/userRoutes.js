const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const verifyToken = require("../middleware/verifyToken");
const crypto = require("crypto");
require("dotenv").config();
const nodemailer = require("nodemailer");

const router = express.Router();

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  path: "/",
  expires: new Date(Date.now() + 60 * 60 * 1000),
};

// User Registration
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verified: false, // User is not verified initially
    });

    await user.save();
    res
      .status(201)
      .json({ message: "Signup successful. Please verify your email." });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ error: "Error signing up" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    if (user.isVerified) {
      // User is verified, proceed to login
      const token = jwt.sign(
        { email: user.email, userId: user._id },
        process.env.JWT_SECRET
      );
      res.cookie("token", token, cookieOptions);
      return res.status(200).json({ message: "Login successful", token });
    } else {
      // User is not verified, generate and send OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();

      // Send OTP via email
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER, // Use environment variables
          pass: process.env.APP_PASS,
        },
      });

      const mailOptions = {
        from: `"Recipe Creator Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: "Your Recipe Creator login code",
        html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 20px;
                background-color: #f8f9fa;
              }
              .container {
                max-width: 500px;
                margin: auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              h2 {
                color: #333;
              }
              .otp {
                font-size: 28px;
                font-weight: bold;
                color: #28a745; /* Green color */
                margin: 10px 0;
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #6c757d;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>Your OTP Code</h2>
              <p>Your OTP for authentication of your Recipe Creator account is:</p>
              <div class="otp">${otp}</div>
              <p>This code expires in 10 minutes. Please use this OTP to securely log in.</p>
              <div class="footer">
                If you did not request this OTP, please ignore this email.
              </div>
            </div>
          </body>
        </html>
        `,
        text: `Your OTP for Recipe Creator is: ${otp}. This code expires in 10 minutes. Please use this OTP to securely log in. If you did not request this OTP, please ignore this email.`, // Add this
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        message: "OTP sent to email for verification.",
        otpRequired: true,
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found" });

    // Check if OTP is correct and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // OTP is valid, mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, cookieOptions);
    return res.status(200).json({ message: "Verification successful", token });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Profile
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Get All Users
router.get("/all", verifyToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logout successful" });
});

// Delete User
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ email: req.user.email });
    if (deletedUser)
      res.status(200).json({ message: "User deleted successfully" });
    else res.status(404).json({ error: "User not found" });
  } catch (error) {
    res.status(500).json({ error: "Server error while deleting user" });
  }
});

module.exports = router;

/* router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    const token = jwt.sign({ email, userId: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ message: "OTP verified successfully!", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to verify OTP" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ error: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOtpEmail(email, otp);
    res
      .status(200)
      .json({ message: "OTP sent to email. Please verify to reset password." });
  } catch (error) {
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successful. You can now log in." });
  } catch (error) {
    res.status(500).json({ error: "Failed to reset password" });
  }
}); */
