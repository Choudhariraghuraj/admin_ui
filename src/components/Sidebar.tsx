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
          backgroundColor: "#1e1e2f",
          color: "#fff",
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
                  backgroundColor: "#4c4c70",
                  borderRadius: 2,
                },
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}

          <ListItemButton
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            sx={{ mt: "auto", color: "#f44336" }}
          >
            <ListItemIcon sx={{ color: "inherit" }}><Logout /></ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
