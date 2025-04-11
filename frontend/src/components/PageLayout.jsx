// src/components/PageLayout.jsx
import React from "react";
import { Box } from "@mui/material";

// Define AppBar heights (can be imported from a shared constants file)
const appBarHeight = "64px"; // Default MUI AppBar height for sm and up
const mobileAppBarHeight = "56px"; // Default MUI AppBar height for xs

// This component wraps the content of authenticated pages
function PageLayout({ children }) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        width: "100%",
        // Apply padding top equal to the AppBar height
        pt: { xs: mobileAppBarHeight, sm: appBarHeight },
        // Apply consistent horizontal and bottom padding
        px: 3,
        pb: 3,
        boxSizing: "border-box",
      }}
    >
      {children} {/* Render the actual page content */}
    </Box>
  );
}

export default PageLayout;
