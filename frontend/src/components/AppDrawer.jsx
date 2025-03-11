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

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography variant="h6" noWrap>
          Recipe Creator AI
        </Typography>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        <ListItem button component={Link} to="/home">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/recipe">
          {" "}
          <ListItemIcon>
            {" "}
            <FastfoodIcon />{" "}
          </ListItemIcon>{" "}
          <ListItemText primary="Recipe" />{" "}
        </ListItem>{" "}
        <ListItem button component={Link} to="/fav">
          {" "}
          <ListItemIcon>
            {" "}
            <FavoriteIcon />{" "}
          </ListItemIcon>{" "}
          <ListItemText primary="Favorites" />{" "}
        </ListItem>{" "}
        <ListItem button component={Link} to="/settings">
          {" "}
          <ListItemIcon>
            {" "}
            <SettingsIcon />{" "}
          </ListItemIcon>{" "}
          <ListItemText primary="Settings" />{" "}
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <Toolbar
        sx={{
          display: { sm: "none" },
          position: "fixed",
          width: "100%",
          zIndex: 1300,
          bgcolor: "#f8f8ff",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
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
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { width: drawerWidth },
          bgColor: "#f8f8ff",
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        open
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#f8f8ff",
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: 0, sm: `${drawerWidth}px` },
          mt: { xs: 8, sm: 0 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default AppDrawer;
