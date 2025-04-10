import React, { useState, useEffect, useCallback } from "react"; // Import useCallback
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
  const [loading, setLoading] = useState(false); // Consider separate loading states if needed
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Redirect to login if no token is found on initial check
  useEffect(() => {
    if (!token) {
      // Only navigate if the user isn't already on login/register
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/register"
      ) {
        navigate("/login");
      }
    }
  }, [token, navigate]); // Dependency on token ensures this check runs if token changes

  // --- Data Fetching Functions ---
  // Use useCallback to memoize fetch functions if passed as props,
  // though ideally, avoid passing them if only data is needed.

  const fetchUserData = useCallback(async () => {
    if (!token) return; // Don't fetch if no token
    console.log("Fetching User Data..."); // Add logs for debugging
    setLoading(true); // Maybe use a specific loading state like setUserLoading(true)
    try {
      const response = await axios.get(UserProfileUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Check for successful status code (e.g., 200 OK)
      if (response.status === 200) {
        setUser(response?.data);
      } else {
        throw new Error(
          `Failed to fetch user: ${response.statusText} (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      // Handle error appropriately (e.g., show message, clear user, logout)
      // localStorage.removeItem("authToken"); // Optional: clear token on auth error
      // setUser(null);
      // navigate("/login");
    } finally {
      setLoading(false); // setUserLoading(false)
    }
  }, [token]); // Recreate function if token changes

  const fetchUserRecipes = useCallback(async () => {
    if (!token) return;
    console.log("Fetching User Recipes...");
    // setLoading(true); // Use separate loading state if needed
    try {
      const response = await axios.get(GetUserRecipesUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setRecipes(response?.data);
      } else {
        throw new Error(
          `Failed to fetch user recipes: ${response.statusText} (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error("Error fetching user recipes:", error.message);
    } finally {
      // setLoading(false);
    }
  }, [token]);

  const fetchUserFavRecipes = useCallback(async () => {
    if (!token) return;
    console.log("Fetching User Favorites...");
    // setLoading(true); // Use separate loading state if needed
    try {
      const response = await axios.get(GetFavUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setFavorites(response?.data);
      } else {
        throw new Error(
          `Failed to fetch favorites: ${response.statusText} (Status: ${response.status})`
        );
      }
    } catch (error) {
      console.error("Error fetching favorites:", error.message);
    } finally {
      // setLoading(false);
    }
  }, [token]);

  // --- Effect for Initial Data Load ---
  useEffect(() => {
    if (token) {
      console.log("Token found, fetching initial data.");
      // Fetch all essential data once when the token is available
      fetchUserData();
      fetchUserRecipes();
      fetchUserFavRecipes();
    } else {
      // If token becomes null (logout), clear user data
      setUser(null);
      setRecipes([]);
      setFavorites([]);
      console.log("Token not found or removed, clearing data.");
    }
  }, [token, fetchUserData, fetchUserRecipes, fetchUserFavRecipes]); // Include memoized fetch functions in deps

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    // setUser(null); // State will be cleared by the useEffect watching the token
    // setRecipes([]);
    // setFavorites([]);
    navigate("/login");
  };

  return (
    <>
      <Alert />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage setUser={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          element={
            // Render AppDrawer (layout) only if user is authenticated
            token ? (
              <AppDrawer user={user} logout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route
            path="/home"
            element={
              // Pass data down, not necessarily the fetch functions unless needed for refresh
              <Home
                user={user} // Pass user data
                recipes={recipes}
                favorites={favorites}
                fetchUserFavRecipes={fetchUserFavRecipes}
                fetchUserRecipes={fetchUserRecipes}
                fetchUserData={fetchUserData}
                // Pass specific refresh functions if needed, e.g., refreshRecipes={fetchUserRecipes}
                // Avoid passing fetchUserData if Home doesn't need to trigger a full profile refetch
              />
            }
          />
          <Route
            path="/recipe"
            element={
              <RecipeScreen
                user={user} // Pass user data
                recipes={recipes}
                favorites={favorites}
                fetchUserRecipes={fetchUserRecipes} // Keep if RecipeScreen needs to refresh recipes
                fetchUserFavRecipes={fetchUserFavRecipes} // Keep if RecipeScreen needs to refresh favs
                fetchUserData={fetchUserData}
                // Avoid passing fetchUserData
              />
            }
          />
          <Route
            path="/fav"
            element={
              <FavouriteScreen
                user={user} // Pass user data
                favorites={favorites}
                fetchUserFavRecipes={fetchUserFavRecipes} // Keep if FavScreen needs to refresh favs
                fetchUserData={fetchUserData}
                // Avoid passing fetchUserData or fetchUserRecipes
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingScreen
                user={user}
                setUser={setUser} // Needed to update user after profile edit
                loading={loading}
                fetchUserData={fetchUserData} // Pass ONLY if settings needs to RE-FETCH after update
              />
            }
          />
          <Route path="/recipe/:id" element={<DetailScreen user={user} />} />{" "}
          {/* Pass user if needed */}
        </Route>

        {/* Fallback Route - Redirect root to home if logged in, else login */}
        <Route
          path="/"
          element={<Navigate to={token ? "/home" : "/login"} />}
        />

        {/* Optional: Catch-all for undefined routes */}
        <Route
          path="*"
          element={<Navigate to={token ? "/home" : "/login"} />}
        />
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
