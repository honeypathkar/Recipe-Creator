import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GetRecipeByID } from "../../API"; // Ensure path is correct

// Import Material Icons
import ArrowBack from "@mui/icons-material/ArrowBack";
import RestaurantMenu from "@mui/icons-material/RestaurantMenu";
import ListAlt from "@mui/icons-material/ListAlt";
import IntegrationInstructionsOutlined from "@mui/icons-material/IntegrationInstructionsOutlined";
import ReportProblem from "@mui/icons-material/ReportProblem";

// --- Skeleton Component Definition (Box-less) ---
const RecipeDetailSkeleton = () => {
  return (
    // 1. Outer container - Removed bg-slate-50. Keeps padding. Added animate-pulse here.
    <div className="min-h-screen p-4 md:p-8 animate-pulse">
      {/* 2. Content width container - Removed card styles (bg, shadow, rounded) */}
      <div className="w-full max-w-3xl mx-auto">
        {/* Skeleton Back button - Now directly in container */}
        <div className="mb-8">
          <div className="h-6 w-24 bg-slate-200 rounded"></div>
        </div>

        {/* Skeleton Title & Cuisine */}
        <div className="mb-8 text-center">
          <div className="h-8 bg-slate-300 rounded w-3/4 mb-3 mx-auto"></div>
          <div className="h-5 bg-slate-200 rounded w-1/3 mx-auto"></div>
        </div>

        {/* Skeleton Divider */}
        <div className="h-px bg-slate-200 w-full my-8"></div>

        {/* Skeleton Ingredients */}
        <div className="mb-8">
          <div className="h-7 bg-slate-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-5 bg-slate-200 rounded w-full"></div>
            <div className="h-5 bg-slate-200 rounded w-5/6"></div>
            <div className="h-5 bg-slate-200 rounded w-full"></div>
            <div className="h-5 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>

        {/* Skeleton Divider */}
        <div className="h-px bg-slate-200 w-full my-8"></div>

        {/* Skeleton Instructions */}
        <div>
          <div className="h-7 bg-slate-300 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            <div className="h-16 bg-slate-200 rounded w-full"></div>
            <div className="h-12 bg-slate-200 rounded w-full"></div>
            <div className="h-16 bg-slate-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
// --- End Skeleton Component Definition ---

// --- Main DetailScreen Component ---
const DetailScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(`${GetRecipeByID}/${id}`, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        });
        if (response.data) {
          setRecipe(response.data);
        } else {
          throw new Error("Recipe data not found in response");
        }
      } catch (err) {
        console.error("Error fetching recipe details:", err);
        const errorMessage =
          err?.response?.data?.message || "Failed to fetch recipe details.";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchRecipeDetails();
    } else {
      setError("No recipe ID provided.");
      setLoading(false);
      toast.error("No recipe ID provided.");
    }
  }, [id]);

  const handleBackNavigation = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/recipe", { replace: true });
    }
  };

  // --- Render Logic ---

  if (loading) {
    return <RecipeDetailSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center">
        {" "}
        {/* Removed bg-slate-50 */}{" "}
        <ReportProblem
          sx={{ fontSize: 64, color: "rgb(239 68 68 / 0.6)", marginBottom: 2 }}
        />{" "}
        <p className="text-xl text-slate-600 mb-2">Error Loading Recipe</p>{" "}
        <p className="text-slate-500 mb-6">{error}</p>{" "}
        <button
          onClick={handleBackNavigation}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 font-semibold flex items-center"
        >
          {" "}
          <ArrowBack sx={{ fontSize: 20, mr: 1 }} /> Go Back{" "}
        </button>{" "}
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center p-4 text-center">
        {" "}
        {/* Removed bg-slate-50 */}{" "}
        <p className="text-xl text-slate-600 mb-6">Recipe details not found.</p>{" "}
        <button
          onClick={handleBackNavigation}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200 font-semibold flex items-center"
        >
          {" "}
          <ArrowBack sx={{ fontSize: 20, mr: 1 }} /> Go Back{" "}
        </button>{" "}
      </div>
    );
  }

  const {
    title = "Untitled Recipe",
    cuisine = "N/A",
    ingredients = [],
    instructions = [],
  } = recipe;

  return (
    // 1. Outer container - Removed bg-slate-50. Keeps padding.
    <div className="min-h-screen p-4 md:p-8">
      {/* 2. Content width container - Removed card styles (bg, shadow, rounded, p-). Added pt/pb for spacing. */}
      <div className="w-full max-w-3xl mx-auto pt-6 pb-12">
        {" "}
        {/* Added vertical padding here */}
        {/* --- Back Button (now directly inside container) --- */}
        <div className="mb-8">
          {" "}
          {/* Added margin bottom */}
          <button
            onClick={handleBackNavigation}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-200 focus:outline-none"
          >
            <ArrowBack sx={{ fontSize: 20, mr: 0.5 }} />
            Back
          </button>
        </div>
        {/* --- Recipe Content Area (Single Column, No Card Background) --- */}
        {/* Title and Cuisine - Centered */}
        <div className="mb-8 text-center">
          <span className="text-blue-500 mb-2 inline-block">
            <RestaurantMenu sx={{ fontSize: 30 }} />
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-2">
            {title}
          </h1>
          <p className="text-slate-500 text-md font-medium">
            Cuisine:{" "}
            <span className="font-semibold text-slate-600">{cuisine}</span>
          </p>
        </div>
        {/* Divider */}
        <hr className="my-8 border-slate-200" />{" "}
        {/* Keep dividers for separation */}
        {/* Ingredients Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-700 mb-4 flex items-center">
            <ListAlt sx={{ fontSize: 28, mr: 1.5 }} className="text-blue-500" />
            Ingredients
          </h2>
          <ul className="space-y-2 pl-1">
            {ingredients.length > 0 ? (
              ingredients.map((item, index) => (
                <li
                  key={index}
                  className="text-base text-slate-700 flex items-center"
                >
                  <span className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-3 flex-shrink-0"></span>
                  <div>
                    {" "}
                    <span className="font-medium">{item.item}:</span>{" "}
                    <span className="ml-1">{item.quantity}</span>{" "}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-base text-slate-500 italic ml-4">
                No ingredients listed.
              </li>
            )}
          </ul>
        </div>
        {/* Divider */}
        <hr className="my-8 border-slate-200" />{" "}
        {/* Keep dividers for separation */}
        {/* Instructions Section */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-700 mb-5 flex items-center">
            <IntegrationInstructionsOutlined
              sx={{ fontSize: 28, mr: 1.5 }}
              className="text-blue-500"
            />
            Instructions
          </h2>
          <ol className="space-y-5">
            {instructions.length > 0 ? (
              instructions.map((instruction, index) => (
                <li
                  key={index}
                  className="text-base text-slate-700 leading-relaxed flex"
                >
                  <span className="flex items-center justify-center h-6 w-6 bg-blue-500 text-white rounded-full font-bold text-sm mr-4 flex-shrink-0">
                    {" "}
                    {instruction.step ?? index + 1}{" "}
                  </span>
                  <p>{instruction.description}</p>
                </li>
              ))
            ) : (
              <li className="text-base text-slate-500 italic ml-10">
                No instructions provided.
              </li>
            )}
          </ol>
        </div>
      </div>{" "}
      {/* End Content width container */}
    </div> // End Outer container
  );
};

export default DetailScreen;
