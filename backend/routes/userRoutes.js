const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const verifyToken = require("../middleware/verifyToken");

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
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: "User already exists" });

    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    const token = jwt.sign(
      { email, userId: newUser._id },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, cookieOptions);

    res.status(200).json({ message: "User registered successfully!", token });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
});

// User Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(400).json({ error: "Invalid username or password" });

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET
    );
    res.cookie("token", token, cookieOptions);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
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
router.get("/all", async (req, res) => {
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
