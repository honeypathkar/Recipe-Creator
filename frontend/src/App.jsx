import React, { useState, useEffect } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import AppDrawer from "./components/AppDrawer";
import FavouriteScreen from "./screens/FavouriteScreen";
import Home from "./screens/HomeScreen";
import RecipeScreen from "./screens/RecipeScreen";
import SettingScreen from "./screens/SettingScreen";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Alert from "./components/Alert";
import DetailScreen from "./screens/DetailScreen";
import "./App.css";
import { GetFavUrl, GetUserRecipesUrl, UserProfileUrl } from "../API";
import axios from "axios";

function AppWrapper() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const fetchUserRecipes = async () => {
    try {
      const response = await axios.get(GetUserRecipesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.status) throw new Error("Failed to fetch user recipes");
      setRecipes(response?.data);
    } catch (error) {
      console.error("Error fetching user recipes:", error.message);
    }
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(UserProfileUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.status)
        throw new Error(`Failed to fetch: ${response.statusText}`);
      setUser(response?.data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFavRecipes = async () => {
    try {
      const response = await axios.get(GetFavUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.status) throw new Error("Failed to fetch favorites");
      setFavorites(response?.data);
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchUserRecipes();
      fetchUserFavRecipes();
    }
  }, [token]);

  return (
    <>
      <Alert />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />

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
    </>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
