const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const verifyToken = require("../middleware/verifyToken");
const crypto = require("crypto");
require("dotenv").config();
const nodemailer = require("nodemailer");
const sendOtp = require("../middleware/sendOtp");

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
      await sendOtp(user);

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

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email address is required." });
    }

    const user = await User.findOne({ email });

    // Check if user exists AND is verified
    if (user && user.isVerified) {
      try {
        // User exists and is verified, send OTP
        await sendOtp(user);
        console.log(`Password reset OTP sent to verified user: ${email}`);
        return res.status(200).json({
          message: "OTP sent to your verified email address.",
        });
      } catch (otpError) {
        console.error("Forgot Password - OTP Sending Error:", otpError);
        // If OTP sending fails, send a generic server error
        return res
          .status(500)
          .json({ error: "Failed to send OTP. Please try again later." });
      }
    } else if (user && !user.isVerified) {
      // User exists but is not verified
      console.log(`Password reset request for unverified email: ${email}`);
      return res.status(403).json({
        error:
          "Account associated with this email is not verified. Please verify your account first.",
      });
    } else {
      // User does not exist
      console.log(`Password reset requested for non-existent email: ${email}`);
      // Send a specific message indicating the issue
      return res
        .status(404)
        .json({ error: "No verified account found with this email address." });
    }
  } catch (error) {
    console.error("Forgot Password Route Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

router.post("/reset-password-with-otp", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validate input
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, OTP, and new password are required." });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Password must be at least 6 characters long." });
    }

    const user = await User.findOne({ email });

    // Check if user exists and is verified
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (!user.isVerified) {
      return res.status(403).json({ error: "Account is not verified." });
    }

    // Check OTP validity and expiry
    const now = new Date();
    if (user.otp !== otp || !user.otpExpiry || user.otpExpiry <= now) {
      // Clear invalid/expired OTP for security
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // --- OTP is valid ---

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password
    user.password = hashedPassword;

    // Clear the OTP fields as they have been successfully used
    user.otp = undefined;
    user.otpExpiry = undefined;

    // Save the updated user document
    await user.save();

    console.log(`Password updated successfully via OTP for user: ${email}`);

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error("Reset Password with OTP Route Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
