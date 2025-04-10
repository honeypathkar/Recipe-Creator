import React, { useState } from "react";
import { toast } from "react-toastify";
import RecipeCard from "./RecipeCard";
import RecipeCardSkeleton from "./RecipeCardSkeleton"; // Import the skeleton
import NoRecipeImage from "../images/no-favorite.png"; // Ensure this path is correct
import axios from "axios";
import { AddCircleOutline, CloseSharp } from "@mui/icons-material";
import { RecipeCreateUrl } from "../../API"; // Ensure this path is correct

const RecipeForm = ({
  fetchUserData,
  fetchUserRecipes,
  recipes = [], // Default prop
  user,
  favorites = [], // Default prop
  fetchUserFavRecipes,
}) => {
  const [ingredient, setIngredient] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [members, setMembers] = useState("");
  const [cuisine, setCuisine] = useState("Indian"); // Default value
  const [language, setLanguage] = useState("English"); // Default value
  const [loading, setLoading] = useState(false); // Loading state for form submission

  const handleAddIngredient = (e) => {
    e.preventDefault(); // Prevent default form submission if inside form
    if (ingredient.trim() && !ingredientsList.includes(ingredient.trim())) {
      setIngredientsList([...ingredientsList, ingredient.trim()]);
      setIngredient(""); // Clear input after adding
    }
  };

  // Allow adding ingredient by pressing Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Prevent default Enter behavior (like submitting the form prematurely)
      e.preventDefault();
      handleAddIngredient(e);
    }
  };

  const removeIngredient = (itemToRemove) => {
    setIngredientsList(ingredientsList.filter((item) => item !== itemToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    const token = localStorage.getItem("authToken");

    if (!token) {
      toast.error("You must be logged in to create a recipe.");
      return;
    }
    if (ingredientsList.length === 0) {
      toast.warn("Please add at least one ingredient or dish name.");
      return;
    }

    const formData = {
      ingredients: ingredientsList,
      members: members || undefined, // Send undefined if empty, handle in backend
      cuisine: cuisine,
      language: language,
    };

    setLoading(true); // Start loading indicator
    try {
      const response = await axios.post(RecipeCreateUrl, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Use status code 201 for resource creation success if backend follows convention
      if (response.status === 200 || response.status === 201) {
        toast.success("Recipe generated successfully!");
        // Clear form fields after successful submission
        setIngredientsList([]);
        setMembers("");
        // Optionally reset cuisine/language or keep them for next entry
        // setCuisine("Indian");
        // setLanguage("English");

        // Fetch updated data *after* successful creation
        if (fetchUserRecipes) fetchUserRecipes();
        if (fetchUserData) fetchUserData();
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting the recipe form:", error);
      toast.error(
        `Failed to generate recipe. ${error?.response?.data?.message || ""}`
      );
    } finally {
      setLoading(false); // End loading indicator regardless of success/failure
    }
  };

  return (
    // Changed main container to allow form and recipes side-by-side on larger screens maybe?
    // For now, keeping vertical stack but adding padding/max-width consistency
    <div className="flex flex-col items-center py-8 px-4">
      {/* --- Recipe Form Section --- */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-6 md:p-8 w-full max-w-3xl mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">
          Generate a New Recipe
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ingredients Input and Add Button */}
          <div className="flex gap-3 items-end flex-wrap sm:flex-nowrap">
            <div className="flex-grow w-full sm:w-auto">
              <label
                htmlFor="ingredients"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Dish Name or Ingredients
              </label>
              <input
                type="text"
                id="ingredients"
                placeholder="Enter item and press Enter or Add"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                onKeyDown={handleKeyDown} // Use Enter key to add
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                disabled={loading}
              />
            </div>
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={handleAddIngredient}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              disabled={loading || !ingredient.trim()}
              title="Add Ingredient" // Tooltip
            >
              <AddCircleOutline fontSize="medium" />
            </button>
          </div>

          {/* Display Added Ingredients as Tags */}
          {ingredientsList.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
              {ingredientsList.map((item, index) => (
                <span
                  key={index}
                  className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700 border border-gray-200"
                >
                  {item}
                  <button
                    type="button" // Prevent form submission
                    onClick={() => removeIngredient(item)}
                    className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                    disabled={loading}
                    title="Remove ingredient" // Tooltip
                  >
                    <CloseSharp fontSize="small" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Other Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="members"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Servings (Optional)
              </label>
              <input
                type="number"
                id="members"
                placeholder="e.g., 4"
                value={members}
                min="1" // Basic validation
                onChange={(e) => setMembers(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Language
              </label>
              <input
                type="text" // Consider changing to select if languages are fixed
                id="language"
                placeholder="e.g., English"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                disabled={loading}
              />
            </div>
            <div>
              <label
                htmlFor="cuisine"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cuisine
              </label>
              <select
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white" // Added bg-white for consistency
                disabled={loading}
              >
                {/* Consider adding a default "Select Cuisine" option */}
                {/* <option value="" disabled>Select Cuisine</option> */}
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
                {/* Add more cuisines as needed */}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full text-white py-3 px-6 rounded-lg font-semibold transition duration-300 ease-in-out flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            }`}
            disabled={loading || ingredientsList.length === 0} // Also disable if no ingredients
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              "Generate Recipe"
            )}
          </button>
        </form>
        {/* Optional separate loading indicator if needed outside the button */}
        {/* {loading && ( ... )} */}
      </div>

      {/* --- Recipes Section --- */}
      {/* Added max-width and centering to align with form */}
      <div className="w-full max-w-6xl mx-auto mt-12 px-2">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
          Your Created Recipes
        </h1>

        {/* --- Conditional Rendering for Recipe List --- */}
        {loading ? (
          // --- SKELETON VIEW WHILE FORM IS GENERATING ---
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Adjust skeleton count as needed */}
            {[...Array(2)].map((_, index) => (
              <RecipeCardSkeleton key={`recipe-skel-${index}`} />
            ))}
          </div>
        ) : // --- END SKELETON VIEW ---

        // --- VIEW WHEN NOT LOADING ---
        recipes.length === 0 ? (
          // --- NO RECIPES VIEW ---
          <div className="flex flex-col justify-center items-center text-center mt-10 py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <img
              src={NoRecipeImage}
              alt="No Recipes Created Yet"
              className="w-48 h-48 opacity-60 mb-4" // Adjusted size/opacity
            />
            <p className="text-lg text-gray-500">
              You haven't created any recipes yet.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Use the form above to generate your first one!
            </p>
          </div>
        ) : (
          // --- END NO RECIPES VIEW ---

          // --- DISPLAY ACTUAL RECIPES ---
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe._id} // Use stable recipe ID as key
                recipe={recipe}
                fetchUserRecipes={fetchUserRecipes}
                fetchUserData={fetchUserData}
                fetchUserFavRecipes={fetchUserFavRecipes}
                user={user}
                favorites={favorites}
              />
            ))}
          </div>
          // --- END DISPLAY ACTUAL RECIPES ---
        )}
        {/* --- End Conditional Rendering --- */}
      </div>
    </div>
  );
};

export default RecipeForm;
