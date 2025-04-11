import React, { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom"; // Use alias to avoid clash with MUI Link
import MenuIcon from "@mui/icons-material/Menu";
import FastfoodIcon from "@mui/icons-material/Fastfood"; // Example App Icon
import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SettingsIcon from "@mui/icons-material/Settings";

// Define navigation pages
const pages = [
  { name: "Home", path: "/home", icon: <HomeIcon fontSize="small" /> },
  { name: "Recipe", path: "/recipe", icon: <FastfoodIcon fontSize="small" /> },
  { name: "Favorites", path: "/fav", icon: <FavoriteIcon fontSize="small" /> },
  // Settings might be better placed in the user menu, but including here as per original drawer
  // { name: 'Settings', path: '/settings', icon: <SettingsIcon fontSize="small" /> },
];

// User-specific settings in the dropdown
const settings = ["Settings", "Logout"];

function Navbar({ user, logout }) {
  // Accept user and logout props
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleUserMenuClick = (setting) => {
    handleCloseUserMenu(); // Close menu first
    if (setting === "Logout") {
      logout(); // Call the logout function passed as prop
    }
    // If 'Settings', navigation will be handled by the RouterLink component
  };

  return (
    <AppBar
      position="fixed"
      sx={{ bgcolor: "#f8f8ff", color: "#333", marginBottom: 20 }}
    >
      {" "}
      {/* Fixed position */}
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* --- Logo/Title (Visible on all screens) --- */}
          <FastfoodIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/home"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Recipe AI
          </Typography>

          {/* --- Mobile Menu --- */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar-nav"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar-nav"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={RouterLink} // Use RouterLink for navigation
                  to={page.path}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* --- Mobile Logo/Title --- */}
          <FastfoodIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/home"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Recipe AI
          </Typography>

          {/* --- Desktop Links --- */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={handleCloseNavMenu} // Close mobile menu if open (optional)
                component={RouterLink} // Use RouterLink
                to={page.path}
                sx={{ my: 2, color: "#333", display: "flex", gap: 0.5, mx: 1 }} // Adjusted color and spacing
                startIcon={page.icon}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* --- User Menu (Avatar & Dropdown) --- */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                  alt={user?.username || "User"} // Use username or default
                  // Add src={user?.profilePicture} if you have profile pictures
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar-user"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => handleUserMenuClick(setting)}
                  // Link to settings page only for the 'Settings' option
                  component={setting === "Settings" ? RouterLink : "div"}
                  to={setting === "Settings" ? "/settings" : undefined}
                >
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
