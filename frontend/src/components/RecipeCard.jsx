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
  if (!recipe) {
    console.warn("RecipeCard rendered without a recipe object.");
    return null;
  }

  const {
    title = "Untitled Recipe",
    cuisine = "Unknown",
    ingredients = [],
    _id,
    createdBy,
  } = recipe; // Added createdBy

  const isFavorite = favorites?.some((fav) => fav?._id === _id); // Added optional chaining

  const handleViewDetails = () => {
    navigate(`/recipe/${_id}`);
  };

  const handleFavoriteClick = async () => {
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

      toast.success(successMessage);
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
      const response = await axios.delete(RecipeDeleteUrl, {
        data: { recipeId: _id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Recipe deleted successfully!");
        fetchUserRecipes();
        fetchUserFavRecipes(); // Refresh favorites in case it was favorited
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
      try {
        await navigator.share({
          title: title,
          text: `Check out this recipe: ${title}`,
          url: recipeUrl,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        if (error.name !== "AbortError") {
          toast.error("Failed to share recipe.");
        }
      }
    } else {
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
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-xl font-semibold text-gray-800 mr-2 break-words">
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

        <p className="text-sm text-gray-500 mb-3">
          {cuisine ? `Cuisine: ${cuisine}` : <>&nbsp;</>}{" "}
        </p>
        {createdBy && createdBy?.name && (
          <p className="text-sm text-gray-500 mb-3">
            {`Created By: ${createdBy?.name}`}
          </p>
        )}

        <div className="mb-4 flex-grow min-h-[80px]">
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

        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <button
            onClick={handleViewDetails}
            className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            See More
            <FaArrowRight className="ml-1.5 h-3 w-3" />
          </button>
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
