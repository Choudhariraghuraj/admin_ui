// src/components/Layout.tsx
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";

const drawerWidth = 240;

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    } else {
      setSidebarOpen(true);
    }
  }, [isMobile]);

  return (
    <Box className="flex h-screen w-full">
             <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
             <Box className="flex flex-col flex-1">
      <Topbar onMenuClick={() => setSidebarOpen((prev) => !prev)} />


      <Box
        component="main"
        className="flex-1 overflow-auto p-4 mt-15"
        sx={{
          ml: !isMobile && sidebarOpen ? `${drawerWidth}px` : 0,
        }}
      >
        <Outlet />
      </Box>
      </Box>
    </Box>
  );
}
