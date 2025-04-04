import { Create, Favorite } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns"; // Import the required function
import { motion } from "framer-motion";
import RecipeCard from "../components/RecipeCard";
import { GetAllRecipe } from "../../API";
import axios from "axios";
// import { getUserData } from "../hooks/profile";

const HomeScreen = ({
  recipes,
  favorites,
  user,
  fetchUserData,
  fetchUserFavRecipes,
  fetchUserRecipes,
}) => {
  const navigate = useNavigate();
  const [allRecipes, setAllRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the createdAt timestamp from the most recent recipe
  const createdAt = recipes[recipes.length - 1]?.createdAt;
  // const addedAt = favorites[favorites.length - 1]?.addedAt;
  // Format the createdAt timestamp into a human-readable format (e.g., '2 hours ago')
  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";

  // const timeAgoSave = addedAt
  //   ? formatDistanceToNow(new Date(addedAt), { addSuffix: true })
  //   : "";

  const addedAt = favorites[favorites.length - 1]?.addedAt;
  const timeAgoSave =
    addedAt && !isNaN(new Date(addedAt).getTime())
      ? formatDistanceToNow(new Date(addedAt), { addSuffix: true })
      : "";

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(GetAllRecipe, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAllRecipes(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <motion.div
      className="p-8"
      style={{ overflowY: "auto" }}
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 50, opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-[90rem] mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome back, Chef!</h1>
        <p className="text-lg mb-8">Let's create something delicious today</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => navigate("/recipe")}
            >
              <div className="bg-blue-100 p-2 rounded-full">
                <Create />
              </div>
              <div>
                <h2 className="text-xl font-semibold">New Recipe</h2>
                <p>Create from ingredients</p>
              </div>
            </div>
          </div>
          <div
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
            onClick={() => navigate("/fav")}
          >
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Favorite />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Favorites</h2>
                <p>Your favorite recipes</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-t-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
          <ul className="py-2">
            <li className="flex items-center space-x-3 mt-3">
              <div className="bg-blue-100 p-2 rounded-full">
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
                <p>
                  {recipes.length == 0
                    ? "No Recipes Created Yet"
                    : `Created ${recipes[recipes.length - 1]?.title}`}
                </p>
                <span className="text-gray-500">{timeAgo}</span>{" "}
                {/* Display time ago */}
              </div>
            </li>
            <li className="flex items-center space-x-3 mt-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Favorite sx={{ color: "red" }} />
              </div>
              <div>
                <p>
                  {favorites.length == 0
                    ? "No Recipe Added to Favorites yet"
                    : `Added to Favorites ${
                        favorites[favorites.length - 1]?.title
                      }`}
                </p>
                <span className="text-gray-500">{timeAgoSave}</span>
              </div>
            </li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">All Recipes</h2>
          {loading ? (
            <p>Loading...</p>
          ) : recipes.length === 0 ? (
            <p>No recipes available.</p>
          ) : (
            <div className="grid md:grid-cols-1 lg:grid-cols-2 grid-cols-1 lg:px-20 lg:py-5 gap-2">
              {allRecipes.map((allRecipes) => (
                <RecipeCard
                  key={allRecipes._id}
                  recipe={allRecipes}
                  favorites={favorites}
                  fetchUserRecipes={fetchUserRecipes}
                  fetchUserFavRecipes={fetchUserFavRecipes}
                  fetchUserData={fetchUserData}
                  user={user}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
