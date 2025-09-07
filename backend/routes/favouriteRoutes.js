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

    // Check if the recipe exists in the database (optional soft check)
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Retrieve the user from the token (added by verifyToken middleware)
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent duplicates: if already favorited, return success
    const already = await Favorite.findOne({ user: user._id, recipe: recipe._id });
    if (already) {
      return res.status(200).json({ message: "Recipe already in favorites", favorite: already });
    }

    // Create a new favorite entry
    const newFavorite = new Favorite({ user: user._id, recipe: recipe._id });
    const savedFavorite = await newFavorite.save();

    // Add the favorite ID to the user's favorites array
    user.favorites.push(savedFavorite._id);
    await user.save();

    res.status(200).json({ message: "Recipe added to favorites", favorite: savedFavorite });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/removeFav", verifyToken, async (req, res) => {
  try {
    // Retrieve the recipe ID from the request body
    const { recipeId } = req.body;

    // Retrieve the user from the token (added by verifyToken middleware)
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the favorite entry to be removed
    const favorite = await Favorite.findOneAndDelete({ user: user._id, recipe: recipeId });

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
    console.log("User from token:", req.user); // Debug Step 1
    const userId = req.user.userId;
    if (!userId) {
      console.error("User ID not found in request after verifyToken");
      return res.status(401).json({ error: "Authentication failed" }); // Or appropriate error
    }
    console.log("Attempting to find favorites for user:", userId); // Debug Step 2

    // Find all favorites for the user
    const userFav = await Favorite.find({ user: userId });
    console.log("Found favorites records:", userFav); // Debug Step 3

    // Fetch the recipes and include the addedAt field from userFav
    const userFavRecipe = await Promise.all(
      userFav.map(async (fav) => {
        try {
          // Add inner try-catch for findById
          console.log(
            `Workspaceing recipe with ID: ${fav.recipe} for favorite ${fav._id}`
          ); // Debug Step 4
          const recipe = await Recipe.findById(fav.recipe);

          if (!recipe) {
            // *** Likely Cause: Handle missing recipes ***
            console.warn(
              `Recipe with ID ${fav.recipe} not found, but favorite ${fav._id} exists.`
            );
            // Decide how to handle: return null, or a placeholder object
            return null;
            // Example placeholder: return { _id: fav.recipe, name: "Recipe Not Found", addedAt: fav.addedAt, isMissing: true };
          }

          // Attach the addedAt time from the favorite record
          return {
            ...recipe.toObject(), // Convert the recipe to a plain object
            addedAt: fav.addedAt, // Include addedAt time
          };
        } catch (recipeError) {
          console.error(
            `Error fetching recipe ID ${fav.recipe} for favorite ${fav._id}:`,
            recipeError.message
          );
          // Decide how to handle: return null, or a placeholder
          return null; // Prevents Promise.all from rejecting entirely
        }
      })
    );

    // Filter out any nulls if you returned null for missing/error recipes
    const validUserFavRecipes = userFavRecipe.filter(
      (recipe) => recipe !== null
    );

    res.status(200).json(validUserFavRecipes); // Send the filtered list
  } catch (error) {
    // This outer catch handles errors like Favorite.find failing, or userId missing if not caught earlier
    console.error(
      "Error fetching user favorites (outer catch):",
      error.message
    );
    console.error(error.stack); // Log the full stack trace for better debugging
    res.status(500).json({ error: "Failed to fetch user favorites" });
  }
});

module.exports = router;
