import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Home,
  People,
  Settings,
  Logout
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
  { label: "Home", icon: <Home />, path: "/dashboard" },
  { label: "Users", icon: <People />, path: "/users" },
  { label: "Settings", icon: <Settings />, path: "/settings" },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) onClose();
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant={isMobile ? "temporary" : "persistent"}
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ mt: 10 }}>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => handleNavigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  backgroundColor: theme.palette.action.selected,
                  borderRadius: 2,
                },
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}

          <ListItemButton
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            sx={{
              mt: 2,
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            <ListItemIcon sx={{ color: theme.palette.error.main }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
