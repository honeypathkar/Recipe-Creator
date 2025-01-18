import React from "react";
import { useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { FaRegTrashAlt } from "react-icons/fa";

const RecipeCard = ({ recipe, onDelete, onFavorite }) => {
  const navigate = useNavigate();

  if (!recipe) return null;

  const { title, cuisine, serves, ingredients } = recipe;

  const handleViewDetails = () => {
    navigate(`/recipe/${recipe._id}`, { state: { recipe } });
  };

  return (
    <div className="relative max-w-xl mx-auto bg-white rounded-lg border-[1px] border-black overflow-hidden">
      {/* Favorite Button */}
      <button
        onClick={onFavorite}
        className="absolute top-4 right-4 text-red-500 hover:text-red-600 focus:outline-none"
      >
        <CiHeart size={30} />
      </button>

      {/* Recipe Details */}
      <div className="p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
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
            onClick={onDelete}
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
