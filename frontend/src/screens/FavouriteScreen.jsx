import React from "react";
import RecipeCard from "../components/RecipeCard"; // Adjust the path as needed
import NoFavoriteImage from "../images/no-favorite.png";

function FavouriteScreen({
  favorites,
  user,
  fetchUserRecipes,
  fetchUserData,
  fetchUserFavRecipes,
}) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Your Favorites</h1>
      {favorites.length == 0 ? (
        <div className="flex flex-col justify-center items-center my-40">
          <img
            src={NoFavoriteImage}
            alt="No Favorite Yet"
            className="w-56 h-56"
          />
          <div className="text-center mt-2">No Favorite Yet</div>
        </div>
      ) : (
        <div className="flex justify-center items-center">
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                favorites={favorites}
                user={user}
                fetchUserData={fetchUserData}
                fetchUserRecipes={fetchUserRecipes}
                fetchUserFavRecipes={fetchUserFavRecipes}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FavouriteScreen;
