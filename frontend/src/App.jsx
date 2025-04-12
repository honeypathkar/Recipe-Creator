import React, { useState, useEffect, useCallback } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { Box } from "@mui/material";
// Import components and screens
import NavBar from "./components/Navbar"; // Ensure correct path
import PageLayout from "./components/PageLayout"; // Import the PageLayout component
import FavouriteScreen from "./screens/FavouriteScreen";
import Home from "./screens/HomeScreen";
import RecipeScreen from "./screens/RecipeScreen";
import SettingScreen from "./screens/SettingScreen";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Alert from "./components/Alert";
import DetailScreen from "./screens/DetailScreen";
import "./App.css";
import {
  GetFavUrl,
  GetUserRecipesUrl,
  UserProfileUrl,
  LogoutUrl,
} from "../API";
import axios from "axios";
import { toast } from "react-toastify";

function AppWrapper() {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // --- Data Fetching Functions ---
  const fetchUserData = useCallback(async () => {
    if (!token) return;
    console.log("Fetching User Data...");
    try {
      const response = await axios.get(UserProfileUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setUser(response?.data);
      } else {
        console.error(
          `Failed to fetch user: ${response.statusText} (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        localStorage.removeItem("authToken");
        setUser(null);
        navigate("/login");
      }
    }
  }, [token, navigate]);

  const fetchUserRecipes = useCallback(async () => {
    if (!token) return;
    console.log("Fetching User Recipes...");
    try {
      const response = await axios.get(GetUserRecipesUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setRecipes(response?.data);
      } else {
        console.error(
          `Failed to fetch user recipes: ${response.statusText} (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error("Error fetching user recipes:", error.message);
    }
  }, [token]);

  const fetchUserFavRecipes = useCallback(async () => {
    if (!token) return;
    console.log("Fetching User Favorites...");
    try {
      const response = await axios.get(GetFavUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setFavorites(response?.data);
      } else {
        console.error(
          `Failed to fetch favorites: ${response.statusText} (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
    }
  }, [token]);

  // --- Effect for Initial Data Load ---
  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setUser(null);
      setRecipes([]);
      setFavorites([]);
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        navigate("/login");
      }
    }
  }, [token, navigate, fetchUserData]);

  useEffect(() => {
    if (user) {
      fetchUserRecipes();
      fetchUserFavRecipes();
    }
  }, [user, fetchUserRecipes, fetchUserFavRecipes]);

  const handleLogout = async () => {
    const token = localStorage.getItem("authToken");
    // Always perform client-side logout actions regardless of backend call success
    const performClientLogout = () => {
      setUser(null);
      localStorage.removeItem("authToken");
      navigate("/login", { replace: true });
      toast.success("Logout Successful");
    };

    if (!token) {
      performClientLogout();
      return;
    }

    try {
      await axios.post(
        LogoutUrl,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Logout Successfull.");
    } catch (error) {
      console.error(
        "Error calling backend logout (proceeding with client logout):",
        error
      );
    } finally {
      performClientLogout();
    }
  };

  return (
    // Outermost Box for overall page structure
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Alert />

      {/* Conditionally render NavBar */}
      {token && <NavBar user={user} logout={handleLogout} />}

      {/* Use Routes to render the appropriate component based on the path */}
      <Routes>
        {/* Public Routes - Do NOT wrap these in PageLayout */}
        <Route
          path="/login"
          element={
            !token ? <LoginPage setUser={setUser} /> : <Navigate to="/home" />
          }
        />
        <Route
          path="/register"
          element={!token ? <RegisterPage /> : <Navigate to="/home" />}
        />

        {/* Protected Routes - Wrap elements in PageLayout */}
        {token ? (
          <>
            <Route
              path="/home"
              element={
                <PageLayout>
                  <Home
                    user={user}
                    recipes={recipes}
                    favorites={favorites}
                    fetchUserFavRecipes={fetchUserFavRecipes}
                    fetchUserRecipes={fetchUserRecipes}
                    fetchUserData={fetchUserData} // Added back
                  />
                </PageLayout>
              }
            />
            <Route
              path="/recipe"
              element={
                <PageLayout>
                  <RecipeScreen
                    user={user}
                    recipes={recipes}
                    favorites={favorites}
                    fetchUserRecipes={fetchUserRecipes}
                    fetchUserFavRecipes={fetchUserFavRecipes}
                    fetchUserData={fetchUserData} // Added back
                  />
                </PageLayout>
              }
            />
            <Route
              path="/fav"
              element={
                <PageLayout>
                  <FavouriteScreen
                    user={user}
                    favorites={favorites}
                    fetchUserFavRecipes={fetchUserFavRecipes}
                    fetchUserData={fetchUserData} // Added back
                    fetchUserRecipes={fetchUserRecipes} // Added back
                  />
                </PageLayout>
              }
            />
            <Route
              path="/settings"
              element={
                <PageLayout>
                  <SettingScreen
                    user={user}
                    setUser={setUser}
                    loading={loading}
                    fetchUserData={fetchUserData} // This was already present
                    handleLogout={handleLogout}
                  />
                </PageLayout>
              }
            />
            <Route
              path="/recipe/:id"
              element={
                <PageLayout>
                  <DetailScreen user={user} />
                </PageLayout>
              }
            />

            {/* Fallback routes for logged-in users */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        ) : (
          // Fallback for any non-public route when logged out
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Box> // End of outermost Box
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
