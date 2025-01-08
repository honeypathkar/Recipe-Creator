import React from "react";
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
  return (
    <Router>
      <Alert />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Layout Route for AppDrawer */}
        <Route element={<AppDrawer />}>
          <Route path="/home" element={<Home />} />
          <Route path="/recipe" element={<RecipeScreen />} />
          <Route path="/fav" element={<FavouriteScreen />} />
          <Route path="/settings" element={<SettingScreen />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
