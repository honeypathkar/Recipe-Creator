import React from "react";
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaRegTrashAlt, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

const RecipeCard = ({
  recipe,
  fetchUserRecipes,
  fetchUserData,
  fetchUserFavRecipes,
  favorites,
}) => {
  const navigate = useNavigate();

  if (!recipe) return null;

  const { title, cuisine, serves, ingredients, _id } = recipe;

  const handleViewDetails = () => {
    navigate(`/recipe/${_id}`, { state: { recipe } });
  };

  // Function to handle favorite button click
  const handleFavoriteClick = async () => {
    try {
      const response = await fetch("http://localhost:5001/favorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: _id }),
        credentials: "include",
      });

      if (response.ok) {
        // setIsFavorited((prev) => !prev); // Toggle favorite status
        toast.success("Recipe added to favorites!");
        fetchUserFavRecipes();
        fetchUserData();
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
      const response = await fetch("http://localhost:5001/delete-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipeId: _id }),
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Recipe deleted!");
        fetchUserRecipes();
        fetchUserFavRecipes();
        fetchUserData();
      } else {
        throw new Error("Failed to delete recipe");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      toast.error("Failed to delete recipe");
    }
  };

  console.log(favorites);

  return (
    <div className="max-w-xl relative bg-white rounded-lg border-[1px] border-black overflow-hidden">
      {/* Favorite Button with conditional color change */}
      <div className="flex items-center">
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
      </div>

      {/* Recipe Details */}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2 pr-[40px]">
          {title}
        </h2>
        <p className="text-gray-600 mb-4">Serves: {serves}</p>
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
