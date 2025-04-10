import React from "react"; // Removed useEffect, useState
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaRegTrashAlt, FaHeart, FaShare } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  AddToFavUrl,
  RecipeDeleteUrl,
  RemoveFavUrl,
  // UserProfileUrl, // No longer needed here
} from "../../API";
import axios from "axios";

const RecipeCard = ({
  recipe,
  fetchUserRecipes,
  fetchUserFavRecipes,
  favorites,
  user, // <-- Accept user as a prop
  fetchUserData,
}) => {
  const navigate = useNavigate();
  // Removed: const [user, setUser] = useState(null);
  // Removed: useEffect fetching user data

  if (!recipe) return null;

  const { title, cuisine, ingredients, _id } = recipe;

  const handleViewDetails = () => {
    navigate(`/recipe/${_id}`);
  };

  const handleFavoriteClick = async () => {
    const isFavorite = favorites.some((fav) => fav._id === _id);
    const url = isFavorite ? RemoveFavUrl : AddToFavUrl;
    const token = localStorage.getItem("authToken");

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

      if (response.status === 200) {
        toast.success(
          isFavorite
            ? "Recipe removed from favorites!"
            : "Recipe added to favorites!"
        );
        fetchUserFavRecipes(); // Refresh favorites list in parent
        fetchUserData();
      } else {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleDelete = async () => {
    // Confirmation dialog before deleting is recommended!
    // if (!window.confirm("Are you sure you want to delete this recipe?")) {
    //   return;
    // }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication token is missing!");
        return;
      }

      const response = await axios.delete(RecipeDeleteUrl, {
        data: { recipeId: _id },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Recipe deleted!");
        fetchUserRecipes(); // Refresh recipes list in parent
        fetchUserFavRecipes(); // Also refresh favorites if it was a favorite
        fetchUserData(); // Refresh user data if needed
      } else {
        throw new Error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error.message);
      toast.error("Failed to delete recipe");
    }
  };

  const handleShareClick = async () => {
    const recipeUrl = `${window.location.origin}/recipe/${_id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out this recipe: ${title}`,
          url: recipeUrl,
        });
        toast.success("Recipe shared successfully!");
      } catch (error) {
        console.error("Error sharing the recipe:", error);
        // Don't show error if user simply cancelled the share dialog
        if (error.name !== "AbortError") {
          toast.error("Failed to share the recipe.");
        }
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      try {
        await navigator.clipboard.writeText(recipeUrl);
        toast.success("Recipe link copied to clipboard!");
      } catch (error) {
        console.error("Error copying the recipe link:", error);
        toast.error("Failed to copy the recipe link.");
      }
    }
  };

  // Determine if the current user owns this recipe
  // Option 1: Check if recipe author ID matches logged-in user ID (Recommended if available)
  // const isOwner = user && recipe.authorId === user._id; // Assuming recipe has authorId and user has _id

  // Option 2: Check if the recipe ID exists in the user's own recipes list (Using your original logic)
  // Make sure the 'user' object fetched in AppWrapper includes the 'recipes' array with IDs.
  const isOwner = user?.recipes?.includes(recipe._id);

  return (
    <div className="max-w-3xl relative bg-white rounded-lg border-[1px] border-black overflow-hidden">
      {/* Favorite and Share buttons */}
      <div className="absolute top-2 right-2 flex flex-col items-end z-10">
        {" "}
        {/* Added z-10 */}
        <button
          onClick={handleFavoriteClick}
          className={`focus:outline-none rounded-full p-2 border-2 bg-white bg-opacity-80 hover:bg-opacity-100 ${
            // Added background for visibility
            favorites.some((fav) => fav._id === _id)
              ? "border-red-600"
              : "border-gray-600"
          }`}
          aria-label={
            favorites.some((fav) => fav._id === _id)
              ? "Remove from favorites"
              : "Add to favorites"
          }
        >
          {favorites.some((fav) => fav._id === _id) ? (
            <FaHeart size={24} className="text-red-600" />
          ) : (
            <CiHeart size={24} className="text-gray-500" />
          )}
        </button>
        <button
          className="focus:outline-none rounded-full p-2 border-2 border-gray-600 mt-1 bg-white bg-opacity-80 hover:bg-opacity-100" // Added background
          onClick={handleShareClick}
          aria-label="Share recipe"
        >
          <FaShare size={20} className="text-gray-500" />{" "}
          {/* Adjusted size slightly */}
        </button>
      </div>

      {/* Card Content */}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 pr-[40px]">
          {" "}
          {/* Added padding-right to avoid overlap */}
          {title}
        </h2>
        <p className="text-gray-600 mb-4">Cuisine: {cuisine}</p>
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
            See More
          </button>
          {/* Use the 'isOwner' variable derived from the 'user' prop */}
          {isOwner && (
            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-1 text-white bg-red-500 rounded-md shadow-md hover:bg-red-600"
            >
              <FaRegTrashAlt className="mr-1" /> Delete {/* Added margin */}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
