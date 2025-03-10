import React from "react";
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaRegTrashAlt, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { FaShare } from "react-icons/fa";
import { AddToFavUrl, RecipeDeleteUrl, RemoveFavUrl } from "../../API";
import axios from "axios";

const RecipeCard = ({
  recipe,
  fetchUserRecipes,
  fetchUserData,
  fetchUserFavRecipes,
  favorites,
}) => {
  const navigate = useNavigate();

  if (!recipe) return null;

  const { title, cuisine, ingredients, _id } = recipe;

  const handleViewDetails = () => {
    navigate(`/recipe/${_id}`, { state: { recipe } });
  };

  // Function to handle favorite button click
  const handleFavoriteClick = async () => {
    const isFavorite = favorites.some((fav) => fav._id === _id);
    const url = isFavorite ? RemoveFavUrl : AddToFavUrl; // Determine API route
    const token = localStorage.getItem("authToken"); // Retrieve token

    try {
      const response = await axios.post(
        url,
        { recipeId: _id }, // Send data properly
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in headers
          },
          withCredentials: true, // Include credentials if needed
        }
      );

      if (response.status === 200) {
        const message = isFavorite
          ? "Recipe removed from favorites!"
          : "Recipe added to favorites!";
        toast.success(message);
        fetchUserFavRecipes(); // Refresh user favorite recipes
        fetchUserData(); // Refresh user data
      } else {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorite status");
    }
  };

  // Function to handle delete button click
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("authToken"); // Check the correct key
      if (!token) {
        toast.error("Authentication token is missing!");
        return;
      }

      const response = await axios.delete(RecipeDeleteUrl, {
        data: { recipeId: _id }, // Correct way to send data in DELETE request
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Recipe deleted!");
        fetchUserRecipes();
        fetchUserFavRecipes();
        fetchUserData();
      } else {
        throw new Error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
      toast.error("Failed to delete recipe");
    }
  };

  // Function to handle sharing the recipe
  const handleShareClick = () => {
    const recipeUrl = `${window.location.origin}/recipe/${_id}`;
    const shareData = {
      title: `Check out this recipe: ${title}`,
      text: `Here's an amazing recipe for ${title}!`,
      url: recipeUrl,
    };

    if (navigator.share) {
      // Use the Web Share API
      navigator
        .share(shareData)
        .then(() => {
          toast.success("Recipe shared successfully!");
        })
        .catch((error) => {
          console.error("Error sharing the recipe:", error);
          toast.error("Failed to share the recipe.");
        });
    } else {
      // Fallback: Copy the link to the clipboard
      navigator.clipboard
        .writeText(recipeUrl)
        .then(() => {
          toast.success("Recipe link copied to clipboard!");
        })
        .catch((error) => {
          console.error("Error copying the recipe link:", error);
          toast.error("Failed to copy the recipe link.");
        });
    }
  };

  return (
    <div className="max-w-xl relative bg-white rounded-lg border-[1px] border-black overflow-hidden">
      {/* Favorite Button with conditional color change */}
      <div className="flex items-center justify-center relative flex-col">
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 right-4 focus:outline-none rounded-full p-3 border-2 ${
            favorites.some((fav) => fav._id === _id)
              ? "border-red-600"
              : "border-gray-600"
          }`}
        >
          {favorites.some((fav) => fav._id === _id) ? (
            <FaHeart size={30} className="text-red-600" />
          ) : (
            <CiHeart size={30} className="text-gray-500" />
          )}
        </button>
        <button
          className="absolute top-4 right-20 focus:outline-none rounded-full p-3 border-2 border-gray-600"
          onClick={handleShareClick}
        >
          <FaShare size={30} className="text-gray-500" />
        </button>
      </div>

      {/* Recipe Details */}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 pr-[40px]">
          {title}
        </h2>
        <p className="text-gray-600 mb-4">Cuisine: {cuisine}</p>

        {/* Ingredients */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ingredients
        </h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
          {ingredients.slice(0, 2).map((item, index) => (
            <li key={index}>
              {item.item}: {item.quantity}
            </li>
          ))}
          {ingredients.length > 2 && (
            <li className="text-gray-500 italic">...and more</li>
          )}
        </ul>

        <div className="flex gap-4 items-center">
          <button
            onClick={handleViewDetails}
            className="px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            See Full Recipe
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center px-3 py-1 text-white bg-red-500 rounded-md shadow-md hover:bg-red-600"
          >
            <FaRegTrashAlt />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
