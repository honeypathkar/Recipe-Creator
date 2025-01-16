import React, { useState } from "react";
import axios from "axios"; // Add this line to import axios
import { toast } from "react-toastify";

const RecipeForm = () => {
  const [ingredient, setIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [members, setMembers] = useState("");
  const [cuisine, setCuisine] = useState("Indian");

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (ingredient.trim() && !ingredientsList.includes(ingredient.trim())) {
      setIngredientsList([...ingredientsList, ingredient.trim()]);
      setIngredient("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAddIngredient(e);
    }
  };

  const removeIngredient = (item) => {
    setIngredientsList(ingredientsList.filter((ing) => ing !== item));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ingredients: ingredientsList,
      members: members,
      cuisine: cuisine,
    };

    console.log("Sending data:", formData); // Log the data you're sending

    try {
      const response = await axios.post(
        "http://localhost:5001/generate-recipe",
        formData
      );
      console.log("Received recipe:", response.data); // Log the response data
      toast.success("Form submitted successfully!");
    } catch (error) {
      console.error(
        "Error submitting the form:",
        error.response ? error.response.data : error.message
      );
      toast.error("Failed to submit the form.");
    }
  };

  return (
    <div className="flex justify-center items-center my-20">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-8">Recipe Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredients Input */}
          <div>
            <label
              htmlFor="ingredients"
              className="block text-gray-700 font-medium mb-2"
            >
              Ingredients
            </label>
            <input
              type="text"
              id="ingredients"
              placeholder="Enter ingredient"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Ingredients List */}
          <div className="flex flex-wrap gap-2">
            {ingredientsList.map((item, index) => (
              <span
                key={index}
                className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm font-medium text-gray-700"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removeIngredient(item)}
                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                >
                  ❌
                </button>
              </span>
            ))}
          </div>
          {/* Members Input */}
          <div>
            <label
              htmlFor="members"
              className="block text-gray-700 font-medium mb-2"
            >
              Number of Members
            </label>
            <input
              type="number"
              id="members"
              placeholder="Enter number of members"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          {/* Cuisine Dropdown */}
          <div>
            <label
              htmlFor="cuisine"
              className="block text-gray-700 font-medium mb-2"
            >
              Cuisine
            </label>
            <select
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
            </select>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;
