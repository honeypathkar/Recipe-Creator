const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const verifyToken = require("../middleware/verifyToken");
require("dotenv").config();
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

//Account Verification
router.post("/verifyAccount", async (req, res) => {
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

//Send Otp for login
router.post("/sendOtp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email address is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message:
          "If your email is registered and verified, an OTP will be sent.",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Your account is not verified. Please verify your email first.",
      });
    }

    await sendOtp(user);

    console.log(`Login OTP sent to email: ${email}`);
    return res.status(200).json({
      message: `OTP sent to your verified email address ${email}. Please check your inbox (and spam folder).`,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res
      .status(500)
      .json({ message: "Failed to send OTP. Please try again later." });
  }
});

//Verify Otp for login
router.post("/verifyOtp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // 1. Validate input
    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required." });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });

    // 3. Handle user not found
    if (!user) {
      // Use generic error to avoid revealing user existence
      return res.status(400).json({ error: "Invalid OTP or email." });
    }

    // 4. Check if OTP exists and hasn't expired
    // Ensure user document HAS otp and otpExpires fields!
    if (!user.otp || user.otpExpiry < Date.now()) {
      // Clear expired/non-existent OTP fields just in case
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save(); // Save the clearance
      return res.status(400).json({ error: "OTP is invalid or has expired." });
    }

    // 5. Compare provided OTP with stored OTP
    // NOTE: For security, OTPs should ideally be hashed in the DB and compared using a secure method.
    // Assuming plaintext comparison for simplicity based on previous context.
    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP or email." }); // Generic error
    }

    // 6. OTP is correct and valid!
    // Clear the OTP fields now that it's used
    user.otp = undefined;
    user.otpExpiry = undefined;

    // If this OTP verification ALSO verifies the user's account for the first time
    // Ensure the user is marked as verified
    if (!user.isVerified) {
      user.isVerified = true;
    }
    await user.save(); // Save changes (OTP clearance and potentially isVerified status)

    // 7. Generate JWT (using the same structure as your /login)
    const payload = {
      email: user.email,
      userId: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    }); // Use same secret and consider expiry time

    // 8. Set JWT as an HTTP-only cookie
    res.cookie("token", token, cookieOptions);

    console.log(`User verified and logged in via OTP: ${email}`);

    // 9. Send success response (mirroring the /login success response)
    return res.status(200).json({
      message: "Verification successful. Logged in.", // Or "Account verified successfully. Logged in."
      token: token, // Send token in body as well
    });
  } catch (error) {
    // 10. Handle errors
    console.error("Error verifying OTP:", error);
    // Use 'error' key consistent with your /login route's error response
    return res
      .status(500)
      .json({ error: "Internal server error during OTP verification." });
  }
});

//Forgot password route
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

//Reset password route
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
