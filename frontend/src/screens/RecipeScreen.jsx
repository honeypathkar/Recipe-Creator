import React from "react";
import RecipeForm from "../components/RecipeForm";

export default function RecipeScreen({
  fetchUserData,
  recipes,
  fetchUserRecipes,
}) {
  return (
    <div>
      <RecipeForm
        fetchUserData={fetchUserData}
        recipes={recipes}
        fetchUserRecipes={fetchUserRecipes}
      />
    </div>
  );
}
