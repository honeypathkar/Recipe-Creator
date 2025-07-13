import {
  Create,
  Favorite,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import RecipeCard from "../components/RecipeCard";
import { GetAllRecipe } from "../../API"; // This should be a string URL
import axios from "axios";
import RecipeCardSkeleton from "../components/RecipeCardSkeleton";

const HomeScreen = ({
  recipes = [],
  favorites = [],
  user,
  fetchUserData,
  fetchUserFavRecipes,
  fetchUserRecipes,
}) => {
  const navigate = useNavigate();
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 9;

  const createdAt = recipes[recipes.length - 1]?.createdAt;
  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";
  const addedAt = favorites[favorites.length - 1]?.addedAt;
  const timeAgoSave =
    addedAt && !isNaN(new Date(addedAt).getTime())
      ? formatDistanceToNow(new Date(addedAt), { addSuffix: true })
      : "";

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${GetAllRecipe}?page=${page}&limit=${limit}`,
          {
            headers: { ...(token && { Authorization: `Bearer ${token}` }) },
          }
        );

        const data = response.data;
        if (data?.recipes) {
          setAllRecipes(data.recipes);
          setTotal(data.total);
        } else {
          setAllRecipes([]);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setAllRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [page]);

  const sortedRecipes = useMemo(() => {
    if (!user?._id) return allRecipes;

    const userId = user._id;
    return [...allRecipes].sort((a, b) => {
      const aIsOwner = a?.createdBy?._id === userId;
      const bIsOwner = b?.createdBy?._id === userId;

      if (aIsOwner && !bIsOwner) return -1;
      if (!aIsOwner && bIsOwner) return 1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [allRecipes, user]);

  const totalPages = Math.ceil(total / limit);

  return (
    <motion.div
      className="p-4 md:p-8 min-h-screen"
      style={{ overflowY: "auto" }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-slate-800">
          Welcome back, {user?.name?.split(" ")[0] || "Chef"}!
        </h1>
        <p className="text-lg mb-8 text-slate-600">
          Let's create something delicious today.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/recipe")}
            >
              <div className="bg-blue-100 p-3 rounded-full">
                <Create className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">New Recipe</h2>
                <p className="text-gray-600">Create from ingredients</p>
              </div>
            </div>
          </div>
          <div
            className="bg-white p-4 md:p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
            onClick={() => navigate("/fav")}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-3 rounded-full">
                <Favorite className="text-red-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Favorites</h2>
                <p className="text-gray-600">Your favorite recipes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-t-lg shadow-md mb-0.5">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                <svg
                  className="w-6 h-6 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </div>
              <div>
                <p className="text-gray-800">
                  {recipes.length === 0
                    ? "No Recipes Created Yet"
                    : `Created ${
                        recipes[recipes.length - 1]?.title || "a recipe"
                      }`}
                </p>
                {timeAgo && (
                  <span className="text-sm text-gray-500">{timeAgo}</span>
                )}
              </div>
            </li>
            <li className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                <Favorite sx={{ color: "red" }} />
              </div>
              <div>
                <p className="text-gray-800">
                  {favorites.length === 0
                    ? "No Recipe Added to Favorites yet"
                    : `Added ${
                        favorites[favorites.length - 1]?.title || "a recipe"
                      } to Favorites`}
                </p>
                {timeAgoSave && (
                  <span className="text-sm text-gray-500">{timeAgoSave}</span>
                )}
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-b-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6">All Recipes</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[...Array(6)].map((_, index) => (
                <RecipeCardSkeleton key={`all-skel-${index}`} />
              ))}
            </div>
          ) : sortedRecipes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No recipes found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sortedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe._id}
                  recipe={recipe}
                  favorites={favorites}
                  user={user}
                  fetchUserRecipes={fetchUserRecipes}
                  fetchUserFavRecipes={fetchUserFavRecipes}
                  fetchUserData={fetchUserData}
                />
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 flex items-center gap-1"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft /> Previous
            </button>
            <span className="font-medium text-gray-700">
              Page {page} out of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 flex items-center gap-1"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HomeScreen;
