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
const Favorite = require("./models/favoriteModel");
require("dotenv").config();

const app = express();
const PORT = 5001;

const clientUrl =
  "http://localhost:5173" || "https://recipe-creator-ai.netlify.app/";

app.use(cors({ credentials: true, origin: clientUrl }));
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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

    const token = jwt.sign(
      { email, userId: newUser._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expiresIn: "1h",
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

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none", // Allow cross-origin cookies in production
      expiresIn: "1h",
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
  // console.log("Received data:", req.body); // Ensure you're receiving data
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

app.post("/delete-recipe", verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.body;

    // Find the recipe by its ID
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Delete the recipe from Recipe collection
    await Recipe.findByIdAndDelete(recipeId);

    // Delete the associated Favorite document if it exists
    const favorite = await Favorite.findOneAndDelete({ recipe: recipeId });
    if (favorite) {
      console.log("Favorite deleted successfully");
    } else {
      console.log("No favorite entry found for this recipe");
    }

    // Find the user who is requesting to delete the recipe
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if recipe exists in user's recipes and favorites
    const recipeIndex = user.recipes.indexOf(recipeId);
    const favoriteIndex = user.favorites.indexOf(
      favorite ? favorite._id : null
    );

    // If the recipe exists in recipes list, remove it
    if (recipeIndex !== -1) {
      user.recipes.splice(recipeIndex, 1); // Remove from recipes
    }

    // If the recipe exists in favorites list, remove it
    if (favoriteIndex !== -1) {
      user.favorites.splice(favoriteIndex, 1); // Remove from favorites
    }

    // Save the user after modification
    await user.save();

    // Respond back
    res
      .status(200)
      .json({ message: "Recipe Deleted from both Recipes and Favorites" });
  } catch (error) {
    console.error("Error deleting recipe:", error);
    res.status(500).json({ message: "Server error" });
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

app.post("/favorite", verifyToken, async (req, res) => {
  try {
    // Retrieve the recipe ID from the request body
    const { recipeId } = req.body;

    // Check if the recipe exists in the database
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Retrieve the user from the token (added by verifyToken middleware)
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new favorite entry
    const newFavorite = new Favorite({
      user: user._id,
      recipe: recipe._id,
    });

    // Save the favorite entry to the database
    const savedFavorite = await newFavorite.save();

    // Add the favorite ID to the user's favorites array
    user.favorites.push(savedFavorite._id);
    await user.save();

    // Respond with the updated favorite entry
    res
      .status(200)
      .json({ message: "Recipe added to favorites", favorite: savedFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get("/userFav", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find all favorites for the user
    const userFav = await Favorite.find({ user: userId });

    // Fetch the recipes and include the addedAt field from userFav
    const userFavRecipe = await Promise.all(
      userFav.map(async (fav) => {
        // Find the recipe by ID
        const recipe = await Recipe.findById(fav.recipe);

        // Attach the addedAt time from the favorite record
        return {
          ...recipe.toObject(), // Convert the recipe to a plain object
          addedAt: fav.addedAt, // Include addedAt time
        };
      })
    );

    res.status(200).json(userFavRecipe);
  } catch (error) {
    console.error("Error fetching user favorites", error.message);
    res.status(500).json({ error: "Failed to fetch user favorites" });
  }
});

app.post("/removeFav", verifyToken, async (req, res) => {
  try {
    // Retrieve the recipe ID from the request body
    const { recipeId } = req.body;

    // Check if the recipe exists in the database
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Retrieve the user from the token (added by verifyToken middleware)
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the favorite entry to be removed
    const favorite = await Favorite.findOneAndDelete({
      user: user._id,
      recipe: recipe._id,
    });

    if (!favorite) {
      return res
        .status(404)
        .json({ message: "Favorite entry not found for this recipe" });
    }

    // Remove the favorite ID from the user's favorites array
    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== favorite._id.toString()
    );
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
