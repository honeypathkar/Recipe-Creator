const express = require("express");
const verifyToken = require("../middleware/verifyToken");
const Recipe = require("../models/recipeModel");
const User = require("../models/userModel");
const Favorite = require("../models/favoriteModel");

const router = express.Router();

router.post("/favorite", verifyToken, async (req, res) => {
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

router.post("/removeFav", verifyToken, async (req, res) => {
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

router.get("/userFav", verifyToken, async (req, res) => {
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

module.exports = router;
