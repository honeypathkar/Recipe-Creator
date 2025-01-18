const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const connectDB = require("./database");
const User = require("./models/userModel");
const { generateRecipe } = require("./recipeGenerator");
const Recipe = require("./models/recipeModel");

const app = express();
const PORT = 5001;

app.use(cors({ credentials: true, origin: "http://localhost:5175" }));
app.use(bodyParser.json());
app.use(cookieParser());

const storage = multer.memoryStorage();
const upload = multer({ storage });

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "shonty");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.post("/userRegister", upload.single("image"), async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    if (!name || !email || !password || !req.file) {
      return res
        .status(400)
        .json({ error: "All fields, including an image, are required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      image: req.file.buffer.toString("base64"),
      contentType: req.file.mimetype,
    });

    await newUser.save();

    const token = jwt.sign({ email, userId: newUser._id }, "shonty");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    res.status(200).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Failed to register user" });
  }
});

app.post("/userLogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
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
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

app.get("/alluser", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  });
  res.status(200).json({ message: "Logout successful" });
});

app.post("/delete", verifyToken, async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ email: req.body.email });
    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error while deleting user" });
  }
});

app.post("/generate-recipe", verifyToken, async (req, res) => {
  console.log("Received data:", req.body); // Ensure you're receiving data
  try {
    const result = await generateRecipe(req.body);
    // console.log("Generated Recipe:", result); // Log the generated recipe

    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).send("user not found");
    }

    const newRecipe = new Recipe({
      title: result.title,
      cuisine: result.cuisine,
      serves: result.serves,
      ingredients: result.ingredients,
      instructions: result.instructions,
      createdBy: user._id,
    });

    // Ensure user has a recipes array
    if (!user.recipes) {
      user.recipes = [];
    }
    user.recipes.push(newRecipe._id);
    await user.save();

    const saveRecipe = await newRecipe.save();
    res.json(saveRecipe); // Return the result to frontend
  } catch (error) {
    console.error("Error in generate-recipe route:", error.message);
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

app.get("/allRecipe", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    console.log("Error fetching recipes: ", error);
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

app.get("/userRecipes", verifyToken, async (req, res) => {
  try {
    // Use the user ID from the verified token to fetch recipes
    const userId = req.user.userId;

    // Query the Recipe model for recipes created by the logged-in user
    const userRecipes = await Recipe.find({ createdBy: userId });

    // Return the recipes in the response
    res.status(200).json(userRecipes);
  } catch (error) {
    console.error("Error fetching user recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch user recipes" });
  }
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
