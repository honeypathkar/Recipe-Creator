import { Create, Favorite } from "@mui/icons-material";
// Make sure useMemo is imported
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import RecipeCard from "../components/RecipeCard";
import { GetAllRecipe } from "../../API"; // Ensure path is correct
import axios from "axios";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

const HomeScreen = ({
  recipes = [],
  favorites = [],
  user, // User object, expected to have _id
  fetchUserData,
  fetchUserFavRecipes,
  fetchUserRecipes,
}) => {
  const navigate = useNavigate();
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Timestamps for recent activity (remains the same)
  const createdAt = recipes[recipes.length - 1]?.createdAt;
  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";
  const addedAt = favorites[favorites.length - 1]?.addedAt;
  const timeAgoSave =
    addedAt && !isNaN(new Date(addedAt).getTime())
      ? formatDistanceToNow(new Date(addedAt), { addSuffix: true })
      : "";

  // Fetching all recipes (remains the same)
  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(GetAllRecipe, {
          headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        });
        setAllRecipes(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setAllRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  // --- NEW: Sort recipes using useMemo ---
  const sortedRecipes = useMemo(() => {
    // Ensure user and user._id are available, otherwise return unsorted
    if (!user?._id) {
      return allRecipes;
    }

    const userId = user._id;

    // Create a shallow copy to avoid mutating the original state array directly
    return [...allRecipes].sort((a, b) => {
      // Check if recipes exist and have the 'createdBy' field (adjust field name if necessary)
      const aIsOwner = a && a.createdBy === userId;
      const bIsOwner = b && b.createdBy === userId;

      if (aIsOwner && !bIsOwner) {
        return -1; // a comes first
      }
      if (!aIsOwner && bIsOwner) {
        return 1; // b comes first
      }
      // If both are owned by user OR neither are owned by user, maintain original relative order (or sort by date)
      // For secondary sort by newest first (optional):
      // if (a.createdAt && b.createdAt) {
      //    return new Date(b.createdAt) - new Date(a.createdAt);
      // }
      return 0; // Keep original relative order otherwise
    });
  }, [allRecipes, user]); // Recalculate only when allRecipes or user changes
  // --- End Sort recipes ---

  return (
    <motion.div
      className="p-4 md:p-8 min-h-screen" // Added background for consistency
      style={{ overflowY: "auto" }}
      initial={{ y: 0, opacity: 0 }} // Start animation from y:0
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }} // Slightly faster transition
    >
      <div className="max-w-7xl mx-auto">
        {" "}
        {/* Increased max-width */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-800">
          Welcome back, {user?.name?.split(" ")[0] || "Chef"}!
        </h1>{" "}
        {/* Use first name */}
        <p className="text-lg mb-8 text-slate-600">
          Let's create something delicious today.
        </p>
        {/* Action Buttons Section (remains the same) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* ... New Recipe Box ... */}
          {/* ... Favorites Box ... */}
          <div className="p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            {" "}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/recipe")}
            >
              {" "}
              <div className="bg-blue-100 p-3 rounded-full">
                {" "}
                <Create className="text-blue-600" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h2 className="text-xl font-semibold">New Recipe</h2>{" "}
                <p className="text-gray-600">Create from ingredients</p>{" "}
              </div>{" "}
            </div>{" "}
          </div>
          <div
            className="bg-white p-4 md:p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => navigate("/fav")}
          >
            {" "}
            <div className="flex items-center space-x-3">
              {" "}
              <div className="bg-red-100 p-3 rounded-full">
                {" "}
                <Favorite className="text-red-500" />{" "}
              </div>{" "}
              <div>
                {" "}
                <h2 className="text-xl font-semibold">Favorites</h2>{" "}
                <p className="text-gray-600">Your favorite recipes</p>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        </div>
        {/* Recent Activity Section (remains the same) */}
        <div className="bg-white p-4 md:p-6 rounded-t-lg shadow-md mb-0.5">
          {/* ... Recent Activity content ... */}
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>{" "}
          <ul className="space-y-4">
            {" "}
            <li className="flex items-center space-x-3">
              {" "}
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                {" "}
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>{" "}
                </svg>{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-gray-800">
                  {" "}
                  {recipes.length === 0
                    ? "No Recipes Created Yet"
                    : `Created ${
                        recipes[recipes.length - 1]?.title || "a recipe"
                      }`}{" "}
                </p>{" "}
                {timeAgo && (
                  <span className="text-sm text-gray-500">{timeAgo}</span>
                )}{" "}
              </div>{" "}
            </li>{" "}
            <li className="flex items-center space-x-3">
              {" "}
              <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                {" "}
                <Favorite sx={{ color: "red" }} />{" "}
              </div>{" "}
              <div>
                {" "}
                <p className="text-gray-800">
                  {" "}
                  {favorites.length === 0
                    ? "No Recipe Added to Favorites yet"
                    : `Added ${
                        favorites[favorites.length - 1]?.title || "a recipe"
                      } to Favorites`}{" "}
                </p>{" "}
                {timeAgoSave && (
                  <span className="text-sm text-gray-500">{timeAgoSave}</span>
                )}{" "}
              </div>{" "}
            </li>{" "}
          </ul>
        </div>
        {/* All Recipes Section */}
        <div className="bg-white p-4 md:p-6 rounded-b-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">All Recipes</h2>{" "}
          {/* Increased margin */}
          {/* Conditional Rendering */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map(
                (
                  _,
                  index // Show 6 skeletons
                ) => (
                  <RecipeCardSkeleton key={`all-skel-${index}`} />
                )
              )}
            </div>
          ) : !loading && sortedRecipes.length === 0 ? ( // Check sortedRecipes length
            <div className="text-center py-10">
              <p className="text-gray-500">No recipes found.</p>
            </div>
          ) : (
            // --- MODIFIED: Map over sortedRecipes ---
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  favorites={favorites}
                  user={user}
                  // Pass down functions needed by RecipeCard
                  fetchUserRecipes={fetchUserRecipes}
                  fetchUserFavRecipes={fetchUserFavRecipes}
                  fetchUserData={fetchUserData}
                />
              ))}
            </div>
            // --- End Map ---
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
