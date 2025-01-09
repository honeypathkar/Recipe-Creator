import { Create, Favorite, SaveRounded } from "@mui/icons-material";
import React from "react";

const HomeScreen = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Welcome back, Chef!</h1>
        <p className="text-lg mb-8">Let's create something delicious today</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Create />
              </div>
              <div>
                <h2 className="text-xl font-semibold">New Recipe</h2>
                <p>Create from ingredients</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <SaveRounded />
              </div>
              <div>
                <h2 className="text-xl font-semibold">My Recipes</h2>
                <p>View saved recipes</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
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
          <ul>
            <li className="flex items-center space-x-3 mb-2">
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
                <p>Created Pasta Recipe</p>
                <span className="text-gray-500">2 hours ago</span>
              </div>
            </li>
            <li className="flex items-center space-x-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-500"
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
                <p>Saved Chicken Curry Recipe</p>
                <span className="text-gray-500">5 hours ago</span>
              </div>
            </li>
            <li className="flex items-center space-x-3 mb-2">
              <div className="bg-red-100 p-2 rounded-full">
                <svg
                  className="w-6 h-6 text-red-500"
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
