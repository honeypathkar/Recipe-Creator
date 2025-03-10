import React, { useState, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppDrawer from "./components/AppDrawer";
import FavouriteScreen from "./screens/FavouriteScreen";
import Home from "./screens/HomeScreen";
import RecipeScreen from "./screens/RecipeScreen";
import SettingScreen from "./screens/SettingScreen";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Navigate } from "react-router-dom";
import Alert from "./components/Alert";
import DetailScreen from "./screens/DetailScreen";
import "./App.css";
import { GetFavUrl, GetUserRecipesUrl, UserProfileUrl } from "../API";

function App() {
  const [user, setUser] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch(`${GetUserRecipesUrl}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user recipes");
      }

      const fetchedRecipes = await response.json();
      setRecipes(fetchedRecipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error.message);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch(UserProfileUrl, {
        credentials: "include",
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavRecipes = async () => {
    try {
      const response = await fetch(`${GetFavUrl}`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user recipes");
      }

      const fetchedFavRecipes = await response.json();
      setFavorites(fetchedFavRecipes);
    } catch (error) {
      console.error("Error fetching user recipes:", error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserRecipes();
    fetchUserFavRecipes();
  }, []);

  return (
    <Router>
      <Alert />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Layout Route for AppDrawer */}
        <Route element={<AppDrawer />}>
          <Route
            path="/home"
            element={
              user ? (
                <Home
                  user={user}
                  recipes={recipes}
                  favorites={favorites}
                  fetchUserRecipes={fetchUserRecipes}
                  fetchUserFavRecipes={fetchUserFavRecipes}
                  fetchUserData={fetchUserData}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/recipe"
            element={
              <RecipeScreen
                fetchUserData={fetchUserData}
                recipes={recipes}
                fetchUserRecipes={fetchUserRecipes}
                fetchUserFavRecipes={fetchUserFavRecipes}
                user={user}
                favorites={favorites}
              />
            }
          />
          <Route
            path="/fav"
            element={
              <FavouriteScreen
                favorites={favorites}
                user={user}
                fetchUserRecipes={fetchUserRecipes}
                fetchUserData={fetchUserData}
                fetchUserFavRecipes={fetchUserFavRecipes}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingScreen user={user} setUser={setUser} loading={loading} />
            }
          />
          <Route path="/recipe/:id" element={<DetailScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
