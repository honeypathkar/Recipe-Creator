import React, { useState } from "react";
import { toast } from "react-toastify";
import RecipeCard from "./RecipeCard";
import NoRecipeImage from "../images/no-favorite.png";
import axios from "axios";
import { AddCircleOutline, CloseSharp } from "@mui/icons-material";
import { RecipeCreateUrl } from "../../API";

const RecipeForm = ({
  fetchUserData,
  fetchUserRecipes,
  recipes,
  user,
  favorites,
  fetchUserFavRecipes,
}) => {
  const [ingredient, setIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [members, setMembers] = useState("");
  const [cuisine, setCuisine] = useState("Indian");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false); // Loading state

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
    const token = localStorage.getItem("authToken"); // Retrieve the token

    const formData = {
      ingredients: ingredientsList,
      members: members,
      cuisine: cuisine,
      language: language,
    };

    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        `${RecipeCreateUrl}`,
        formData, // Send data directly
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include token in headers
          },
          withCredentials: true, // Ensure cookies are sent
        }
      );

      if (response.status == 200) {
        toast.success("Recipe generated successfully!");
        setIngredientsList([]);
        setMembers("");
      }

      // Fetch all updated recipes
      fetchUserRecipes();
      fetchUserData();
    } catch (error) {
      console.error("Error submitting the form:", error.message);
      toast.error("Failed to submit the form.");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      {/* Recipe Form */}
      <div className="bg-white rounded-lg border-[1px] border-gray-300 shadow-lg p-8 w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-8">Recipe Form</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4 items-end flex-wrap">
            <div className="flex-1">
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
                disabled={loading} // Disable during loading
              />
            </div>
            <button
              onClick={handleAddIngredient} // Ensure this function is defined
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:scale-105 transform transition duration-300 cursor-pointer disabled:bg-gray-400"
              disabled={loading || !ingredient.trim()} // Disable when loading or input is empty
            >
              <AddCircleOutline />
            </button>
          </div>

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
                  className="ml-2 focus:outline-none"
                >
                  <CloseSharp />
                </button>
              </span>
            ))}
          </div>
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
              disabled={loading} // Disable during loading
            />
          </div>
          <div>
            <label
              htmlFor="language"
              className="block text-gray-700 font-medium mb-2"
            >
              Choose Language
            </label>
            <input
              type="text"
              id="language"
              placeholder="Choose language as you desired"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading} // Disable during loading
            />
          </div>
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
              disabled={loading} // Disable during loading
            >
              <option value="Indian">Indian</option>
              <option value="Chinese">Chinese</option>
              <option value="Italian">Italian</option>
              <option value="German">German</option>
              <option value="American">American</option>
              <option value="Turkish">Turkish</option>
              <option value="Russian">Russian</option>
              <option value="French">French</option>
              <option value="Japanese">Japanese</option>
              <option value="Mexican">Mexican</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg hover:scale-105 transform transition duration-300"
            disabled={loading} // Disable button during loading
          >
            {loading ? "Generating..." : "Submit"} {/* Show loading text */}
          </button>
        </form>
        {loading && (
          <div className="mt-4">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <p className="text-center mt-2 text-blue-500">
              Generating Recipe...
            </p>
          </div>
        )}
      </div>

      {/* Recipes Section */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Your Created Recipes
        </h1>
        {recipes.length == 0 ? (
          <div className="flex flex-col justify-center items-center">
            <img
              src={NoRecipeImage}
              alt="No Favorite Yet"
              className="w-56 h-56"
            />
            <div className="text-center mt-2">No Creation Yet</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            {recipes.map((recipe, index) => (
              <RecipeCard
                key={index}
                recipe={recipe}
                fetchUserRecipes={fetchUserRecipes}
                fetchUserData={fetchUserData}
                fetchUserFavRecipes={fetchUserFavRecipes}
                user={user}
                favorites={favorites}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeForm;
