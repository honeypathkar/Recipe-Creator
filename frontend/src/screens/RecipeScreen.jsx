import React from "react";
import RecipeForm from "../components/RecipeForm";

export default function RecipeScreen({
  fetchUserData,
  recipes,
  fetchUserRecipes,
  fetchUserFavRecipes,
  user,
  favorites,
}) {
  return (
    <div>
      <RecipeForm
        fetchUserData={fetchUserData}
        recipes={recipes}
        fetchUserRecipes={fetchUserRecipes}
        fetchUserFavRecipes={fetchUserFavRecipes}
        user={user}
        favorites={favorites}
      />
    </div>
  );
}
