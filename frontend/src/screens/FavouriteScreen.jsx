import React from "react";
import RecipeCard from "../components/RecipeCard"; // Adjust path as needed
import RecipeCardSkeleton from "../components/RecipeCardSkeleton"; // Import skeleton
import NoFavoriteImage from "../images/no-favorite.png"; // Ensure path is correct
import FavoriteBorder from "@mui/icons-material/FavoriteBorder"; // Example icon for empty state

// Added 'loading' prop
function FavouriteScreen({
  favorites = [], // Default to empty array
  user,
  fetchUserFavRecipes,
  fetchUserData,
  loading, // Prop to indicate if favorites are loading
  fetchUserRecipes,
}) {
  // Number of skeletons to display while loading
  const skeletonCount = 6;

  return (
    // Main container with background and padding
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {" "}
        {/* Constrain width for very large screens */}
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-slate-800">
          Your Favorite Recipes
        </h1>
        {/* Conditional Rendering: Loading -> Empty -> Content */}
        {loading ? (
          // --- SKELETON LOADING STATE ---
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(skeletonCount)].map((_, index) => (
              <RecipeCardSkeleton key={`fav-skeleton-${index}`} />
            ))}
          </div>
        ) : !loading && favorites.length === 0 ? (
          // --- EMPTY STATE (NO FAVORITES) ---
          <div className="flex flex-col justify-center items-center text-center mt-16 py-16 bg-white rounded-lg shadow-md border border-dashed border-gray-300">
            <FavoriteBorder
              sx={{ fontSize: 60 }}
              className="text-red-300 mb-4"
            />
            <img
              src={NoFavoriteImage}
              alt="No Favorites Yet"
              className="w-48 h-48 opacity-60 mb-4" // Adjusted size/opacity
            />
            <h2 className="text-xl font-semibold text-gray-600">
              No Favorites Yet
            </h2>
            <p className="text-gray-400 mt-2 max-w-xs">
              Looks like you haven't added any recipes to your favorites. Start
              exploring and save the ones you love!
            </p>
            {/* Optional: Add a button linking to the main recipe exploration page */}
            {/* <button className="mt-6 bg-blue-500 ...">Explore Recipes</button> */}
          </div>
        ) : (
          // --- DISPLAY FAVORITES GRID ---
          // Removed extra flex wrapper, grid handles layout
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe._id} // Use stable ID
                recipe={recipe}
                favorites={favorites} // Pass favorites list for checking status
                user={user}
                fetchUserData={fetchUserData}
                // fetchUserRecipes prop is likely not needed here unless removing a favorite should also refresh a global recipe list differently
                fetchUserFavRecipes={fetchUserFavRecipes} // Essential for updating after unfavorite
                fetchUserRecipes={fetchUserRecipes}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavouriteScreen;
