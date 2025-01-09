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

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5001/profile", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.statusText}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <Router>
      <Alert />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Layout Route for AppDrawer */}
        <Route element={<AppDrawer user={user} />}>
          <Route
            path="/home"
            element={user ? <Home user={user} /> : <Navigate to="/login" />}
          />
          <Route path="/recipe" element={<RecipeScreen />} />
          <Route path="/fav" element={<FavouriteScreen />} />
          <Route path="/settings" element={<SettingScreen user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
