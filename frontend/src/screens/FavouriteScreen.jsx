import React from "react";
import RecipeCard from "../components/RecipeCard"; // Adjust the path as needed
// import { toast } from "react-toastify";

function FavouriteScreen({
  favorites,
  user,
  fetchUserRecipes,
  fetchUserData,
  fetchUserFavRecipes,
}) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Favorites</h1>
      {favorites.length == 0 ? (
        <div>No Favorite Yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      )}
    </div>
  );
}

export default FavouriteScreen;
