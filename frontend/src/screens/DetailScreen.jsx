import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineRestaurantMenu } from "react-icons/md";

const DetailScreen = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const recipe = state?.recipe;

  if (!recipe) return <p>No recipe details found.</p>;

  const { title, cuisine, ingredients, instructions } = recipe;

  const handleBackNavigation = () => {
    navigate("/recipe", { replace: true }); // Navigates back and clears history
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Back Button */}
      <div className="w-full max-w-6xl px-6 py-4 flex items-center bg-white shadow-md">
        <button
          onClick={handleBackNavigation}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" />
          <span className="font-medium text-lg">Back to Recipes</span>
        </button>
      </div>

      {/* Recipe Content */}
      <div className="w-full max-w-6xl p-6 mt-6 bg-white rounded-lg shadow-md">
        {/* Top Section */}
        <div className="flex items-center mb-6">
          <MdOutlineRestaurantMenu className="text-4xl text-blue-500 mr-4" />
          <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
        </div>

        {/* Recipe Details */}
        <div className="mb-6">
          <p className="text-gray-600 text-lg mb-2">
            <strong>Cuisine:</strong> {cuisine}
          </p>
        </div>

        {/* Ingredients Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Ingredients
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            {ingredients.map((item, index) => (
              <li key={index} className="text-lg">
                {item.item}: {item.quantity}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Instructions
          </h2>
          <ol className="list-decimal list-inside text-gray-700">
            {instructions.map((instruction, index) => (
              <li key={index} className="mb-3 text-lg">
                <strong>Step {instruction.step}:</strong>{" "}
                {instruction.description}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DetailScreen;
