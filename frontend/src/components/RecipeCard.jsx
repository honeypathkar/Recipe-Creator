import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaRegTrashAlt, FaHeart, FaShare } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  AddToFavUrl,
  RecipeDeleteUrl,
  RemoveFavUrl,
  UserProfileUrl,
} from "../../API";
import axios from "axios";

const RecipeCard = ({
  recipe,
  fetchUserRecipes,
  fetchUserFavRecipes,
  favorites,
}) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  if (!recipe) return null;

  const { title, cuisine, ingredients, _id } = recipe;

  const handleViewDetails = () => {
    navigate(`/recipe/${_id}`); // Now only passing the ID
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
        fetchUserFavRecipes();
      } else {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorite status");
    }
  };

  const handleDelete = async () => {
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
        fetchUserRecipes();
        fetchUserFavRecipes();
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
        toast.error("Failed to share the recipe.");
      }
    } else {
      try {
        await navigator.clipboard.writeText(recipeUrl);
        toast.success("Recipe link copied to clipboard!");
      } catch (error) {
        console.error("Error copying the recipe link:", error);
        toast.error("Failed to copy the recipe link.");
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(UserProfileUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response?.data);
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };
    fetchUserData();
  }, []);

  return (
    <div className="max-w-3xl relative bg-white rounded-lg border-[1px] border-black overflow-hidden">
      <div className="absolute top-2 right-2 flex flex-col items-end">
        <button
          onClick={handleFavoriteClick}
          className={`focus:outline-none rounded-full p-2 border-2 ${
            favorites.some((fav) => fav._id === _id)
              ? "border-red-600"
              : "border-gray-600"
          }`}
        >
          {favorites.some((fav) => fav._id === _id) ? (
            <FaHeart size={24} className="text-red-600" />
          ) : (
            <CiHeart size={24} className="text-gray-500" />
          )}
        </button>
        <button
          className="focus:outline-none rounded-full p-2 border-2 border-gray-600 mt-1"
          onClick={handleShareClick}
        >
          <FaShare size={24} className="text-gray-500" />
        </button>
      </div>

      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 pr-[40px]">
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
          {user?.recipes?.includes(recipe._id) && (
            <button
              onClick={handleDelete}
              className="flex items-center px-3 py-1 text-white bg-red-500 rounded-md shadow-md hover:bg-red-600"
            >
              <FaRegTrashAlt /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
