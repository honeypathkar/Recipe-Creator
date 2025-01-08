import React, { useState } from "react";
import {
  Box,
  Drawer,
  Toolbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
  ListItemIcon,
  Avatar,
} from "@mui/material";
import { Home, Menu } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom"; // Import Outlet to render nested routes

const drawerWidth = 240;

function AppDrawer() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Mock user data (replace with dynamic data as needed)
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePic: "https://via.placeholder.com/150", // Replace with a real profile picture URL
  };

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* App Name */}
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography variant="h6" noWrap>
          Recipe Creator AI
        </Typography>
      </Box>
      <Divider />

      {/* Navigation Links */}
      <List sx={{ flexGrow: 1 }}>
        <ListItem button component={Link} to="/home">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/recipe">
          <ListItemIcon>
            <FastfoodIcon />
          </ListItemIcon>
          <ListItemText primary="Recipe" />
        </ListItem>
        <ListItem button component={Link} to="/fav">
          <ListItemIcon>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </ListItem>
        <ListItem button component={Link} to="/settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>

      <Divider />

      {/* User Profile Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          bgcolor: "background.paper",
        }}
      >
        <Avatar src={user.profilePic} alt={user.name} sx={{ mr: 2 }} />
        <Box>
          <Typography variant="body1" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" noWrap>
            {user.email}
          </Typography>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* App Bar for Mobile Menu Button */}
      <Toolbar
        sx={{
          display: { sm: "none" },
          position: "fixed",
          width: "100%",
          zIndex: 1300, // Ensures toolbar stays above the drawer
          bgcolor: "background.default",
          justifyContent: "space-between", // Align items between menu button and name
          alignItems: "center", // Center vertically
          px: 2, // Add horizontal padding
        }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <Menu />
        </IconButton>
        <Typography
          variant="h6"
          noWrap
          sx={{ marginRight: "115px", marginTop: "2px" }}
        >
          Recipe Creator AI
        </Typography>
      </Toolbar>

      {/* Drawer for Small Screens */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Improves performance on mobile
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Permanent Drawer for Larger Screens */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, sm: `${drawerWidth}px` }, // Adjust margin for mobile and desktop
          mt: { xs: 8, sm: 0 }, // Prevent content overlap with toolbar on mobile
        }}
      >
        <Outlet /> {/* Render child components here */}
      </Box>
    </Box>
  );
}

export default AppDrawer;
