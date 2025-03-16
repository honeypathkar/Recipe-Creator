const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const { generateRecipe } = require("../middleware/recipeGenerator");
const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");

const router = express.Router();

// Generate Recipe
router.post("/generate", verifyToken, async (req, res) => {
  try {
    const result = await generateRecipe(req.body);
    const user = await User.findOne({ email: req.user.email });

    if (!user) return res.status(404).send("User not found");

    const newRecipe = new Recipe({
      title: result.title,
      cuisine: result.cuisine,
      ingredients: result.ingredients,
      instructions: result.instructions,
      createdBy: user._id,
    });

    user.recipes.push(newRecipe._id);
    await user.save();
    await newRecipe.save();

    res.json(newRecipe);
  } catch (error) {
    res.status(500).json({ error: "Failed to generate recipe" });
  }
});

// Delete Recipe
router.delete("/delete", verifyToken, async (req, res) => {
  try {
    const { recipeId } = req.body;
    const user = await User.findOne({ email: req.user.email });

    if (!user || !user.recipes.includes(recipeId))
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this recipe" });

    await Recipe.findByIdAndDelete(recipeId);
    user.recipes = user.recipes.filter((id) => id.toString() !== recipeId);
    await user.save();

    res.status(200).json({ message: "Recipe successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Recipes
router.get("/all", async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.status(200).json(recipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
});

// Get User's Recipes
router.get("/user", verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRecipes = await Recipe.find({ createdBy: userId });
    res.status(200).json(userRecipes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user recipes" });
  }
});

router.get("/recipe/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe Not Found" });
    }
    res.status(200).json(recipe);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
