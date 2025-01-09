const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const connectDB = require("./database"); // Import the connectDB function
const User = require("./models/userModel"); // Corrected import to match your model name

const app = express();
const PORT = 5001;

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5174" })); // Allow credentials and frontend origin
app.use(bodyParser.json());
app.use(cookieParser());

// File Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Token verification middleware
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "shonty"); // Using environment variable for secret
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Register route
app.post("/userRegister", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing user
    const user = await User.findOne({ email }); // Corrected UserModel to User
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Validate input fields
    if (!name || !email || !password || !req.file) {
      return res
        .status(400)
        .json({ error: "All fields, including an image, are required" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.buffer.toString("base64"), // Store Base64 image
      contentType: req.file.mimetype, // MIME type
    });

    // Save user to database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ email, userId: newUser._id }, "shonty");

    // Set cookie with token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict", // Ensures the cookie is sent with same-site requests
      path: "/", // Path where the cookie is accessible
    });

    res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Login route
app.post("/userLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }); // Corrected UserModel to User
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign({ email: user.email, userId: user._id }, "shonty");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict", // Ensures the cookie is sent with same-site requests
      path: "/", // Path where the cookie is accessible
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Showing single user after login
app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }); // Corrected UserModel to User
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Getting all users
app.get("/alluser", async (req, res) => {
  try {
    const users = await User.find(); // Corrected UserModel to User
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

//logout route
app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
});

// Connect to MongoDB
connectDB(); // Call the connectDB function here to establish the connection

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
