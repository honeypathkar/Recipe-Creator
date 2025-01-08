import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppDrawer from "./components/AppDrawer";
import FavouriteScreen from "./screens/FavouriteScreen";
import Home from "./screens/HomeScreen";
import RecipeScreen from "./screens/RecipeScreen";
import SettingScreen from "./screens/SettingScreen";

function App() {
  return (
    <Router>
      <AppDrawer>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipe" element={<RecipeScreen />} />
          <Route path="/fav" element={<FavouriteScreen />} />
          <Route path="/settings" element={<SettingScreen />} />
        </Routes>
      </AppDrawer>
    </Router>
  );
}

export default App;
