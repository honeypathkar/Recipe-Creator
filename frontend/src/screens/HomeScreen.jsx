import { Create, Favorite } from "@mui/icons-material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns"; // Import the required function

const HomeScreen = ({ recipes }) => {
  const navigate = useNavigate();

  // Get the createdAt timestamp from the most recent recipe
  const createdAt = recipes[recipes.length - 1]?.createdAt;

  // Format the createdAt timestamp into a human-readable format (e.g., '2 hours ago')
  const timeAgo = createdAt
    ? formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    : "";

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
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
        <div className="bg-white p-6 rounded-lg shadow-md">
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
                <p>Created {recipes[recipes.length - 1]?.title}</p>
                <span className="text-gray-500">{timeAgo}</span>{" "}
                {/* Display time ago */}
              </div>
            </li>
            <li className="flex items-center space-x-3 mt-3">
              <div className="bg-red-100 p-2 rounded-full">
                <Favorite sx={{ color: "red" }} />
              </div>
              <div>
                <p>Added to Favorites</p>
                <span className="text-gray-500">1 day ago</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
