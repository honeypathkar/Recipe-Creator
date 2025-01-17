import React from "react";

const RecipeCard = ({ recipe }) => {
  if (!recipe) return null;

  const { title, serves, ingredients, instructions } = recipe;

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {/* Recipe Details */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">Serves: {serves}</p>

        {/* Ingredients */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Ingredients
        </h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
          {Array.isArray(ingredients)
            ? ingredients.map((item, index) => (
                <li key={index}>
                  {item.item}: {item.quantity}
                </li>
              ))
            : Object.entries(ingredients).map(([key, value], index) => (
                <li key={index}>
                  {key}:{" "}
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </li>
              ))}
        </ul>

        {/* Instructions */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          Instructions
        </h3>
        <ul className="list-inside text-gray-700 space-y-1 mb-4">
          {instructions.map((instruction, index) => (
            <li key={index}>
              <strong>Step {instruction.step}:</strong>{" "}
              {instruction.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RecipeCard;
