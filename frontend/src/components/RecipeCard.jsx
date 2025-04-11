import React from "react";
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaRegTrashAlt, FaHeart, FaShare, FaArrowRight } from "react-icons/fa"; // Ensure FaArrowRight is imported
import { toast } from "react-toastify";
import { AddToFavUrl, RecipeDeleteUrl, RemoveFavUrl } from "../../API";
import axios from "axios";

const RecipeCard = ({
  recipe,
  fetchUserRecipes,
  fetchUserFavRecipes,
  favorites,
  user, // User object passed as prop
  fetchUserData,
}) => {
  const navigate = useNavigate();
  // Early return if recipe data is missing
  if (!recipe) {
    console.warn("RecipeCard rendered without a recipe object.");
    return null;
  }

  // Destructure with default values for safety, though early return helps
  const {
    title = "Untitled Recipe",
    cuisine = "Unknown",
    ingredients = [],
    _id,
    createdBy,
  } = recipe; // Added createdBy

  const isFavorite = favorites?.some((fav) => fav?._id === _id); // Added optional chaining

  // --- Event Handlers ---

  const handleViewDetails = () => {
    navigate(`/recipe/${_id}`);
  };

  const handleFavoriteClick = async () => {
    // Determine URL and success message based on current favorite status
    const url = isFavorite ? RemoveFavUrl : AddToFavUrl;
    const successMessage = isFavorite
      ? "Recipe removed from favorites!"
      : "Recipe added to favorites!";
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("You must be logged in to manage favorites.");
      return;
    }
    if (!_id) {
      toast.error("Cannot favorite recipe: Missing recipe ID.");
      return;
    }

    try {
      const response = await axios.post(
        url,
        { recipeId: _id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check for explicit success status codes (e.g., 200 OK, 201 Created)
      toast.success(successMessage);
      // Refresh relevant data in the parent component
      fetchUserFavRecipes();
      fetchUserData();
      fetchUserRecipes();
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error(
        `Failed to update favorites. ${error?.response?.data?.message || ""}` // Show backend message if available
      );
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(`Are you sure you want to delete the recipe "${title}"?`)
    ) {
      return; // Stop if user cancels
    }

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication token is missing. Cannot delete.");
      return;
    }
    if (!_id) {
      toast.error("Cannot delete recipe: Missing recipe ID.");
      return;
    }

    try {
      // Note: Sending data in the body for DELETE is non-standard but possible with Axios.
      // Ensure your backend API route for RecipeDeleteUrl expects 'recipeId' in the request body.
      const response = await axios.delete(RecipeDeleteUrl, {
        data: { recipeId: _id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Recipe deleted successfully!");
        // Refresh relevant data in the parent component
        fetchUserRecipes();
        fetchUserFavRecipes(); // Refresh favorites in case it was favorited
        // fetchUserData(); // Refresh user data if needed
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error(
        `Failed to delete recipe. ${error?.response?.data?.message || ""}` // Show backend message if available
      );
    }
  };

  const handleShareClick = async () => {
    if (!_id) {
      toast.error("Cannot share recipe: Missing recipe ID.");
      return;
    }
    const recipeUrl = `${window.location.origin}/recipe/${_id}`;

    if (navigator.share) {
      // Use Web Share API if available
      try {
        await navigator.share({
          title: title,
          text: `Check out this recipe: ${title}`,
          url: recipeUrl,
        });
        // Success toast might be redundant as the browser shows confirmation
        // toast.success("Recipe shared!");
      } catch (error) {
        console.error("Error sharing:", error);
        // Ignore error if user cancelled the share action
        if (error.name !== "AbortError") {
          toast.error("Failed to share recipe.");
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(recipeUrl);
        toast.success("Recipe link copied to clipboard!");
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy recipe link.");
      }
    }
  };

  const isOwner = user && createdBy && user._id === createdBy;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
      {/* Optional Image Area */}
      {/* <div className="w-full h-40 bg-gray-200"><img ... /></div> */}

      <div className="p-4 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-800 mr-2 break-words">
            {" "}
            {/* Allow title wrapping */}
            {title}
          </h2>
          <div className="flex space-x-2 flex-shrink-0">
            <button
              onClick={handleFavoriteClick}
              className="text-gray-500 hover:text-red-500 focus:outline-none p-1 rounded-full hover:bg-gray-100"
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
              title={isFavorite ? "Remove from favorites" : "Add to favorites"} // Added title attribute
            >
              {isFavorite ? (
                <FaHeart size={18} className="text-red-500" />
              ) : (
                <CiHeart size={20} />
              )}
            </button>
            <button
              onClick={handleShareClick}
              className="text-gray-500 hover:text-blue-500 focus:outline-none p-1 rounded-full hover:bg-gray-100"
              aria-label="Share recipe"
              title="Share recipe" // Added title attribute
            >
              <FaShare size={16} />
            </button>
          </div>
        </div>

        {/* Cuisine */}
        <p className="text-sm text-gray-500 mb-3">
          {cuisine ? `Cuisine: ${cuisine}` : <>&nbsp;</>}{" "}
          {/* Ensure space is occupied */}
        </p>

        {/* Ingredients Preview */}
        <div className="mb-4 flex-grow min-h-[80px]">
          {" "}
          {/* Ensure min height */}
          <h3 className="text-md font-medium text-gray-700 mb-1">
            Ingredients
          </h3>
          {ingredients && ingredients.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {ingredients.slice(0, 3).map((item, index) => (
                <li
                  key={index}
                  className="truncate"
                  title={`${item.item} (${item.quantity})`}
                >
                  {" "}
                  {/* Added title attribute */}
                  {item.item} ({item.quantity})
                </li>
              ))}
              {ingredients.length > 3 && (
                <li className="text-gray-400 text-xs italic">...see more</li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">
              No ingredients listed.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={handleViewDetails}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            See More
            <FaArrowRight className="ml-1.5 h-3 w-3" />
          </button>
          {/* Conditionally render Delete button */}
          {isOwner && (
            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-1.5 text-sm text-red-600 hover:text-white border border-red-500 hover:bg-red-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              title="Delete this recipe" // Added title attribute
            >
              <FaRegTrashAlt className="mr-1.5 h-3 w-3" /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
