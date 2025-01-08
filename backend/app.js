const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ credentials: true, origin: "http://localhost:5173" })); // Allow credentials and frontend origin
app.use(bodyParser.json());
app.use(cookieParser());

// File Upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
