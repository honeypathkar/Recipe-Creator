import React from "react";
import RecipeForm from "../components/RecipeForm";

export default function RecipeScreen({ fetchUserData }) {
  return (
    <div>
      <RecipeForm fetchUserData={fetchUserData} />
    </div>
  );
}
