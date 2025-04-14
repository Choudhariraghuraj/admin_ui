import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../context/AuthContext";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();
  const { user } = useAuth();

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#1e1e2f", zIndex: 1201 }}>
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Box display="flex" alignItems="center" gap={2}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {user.name}
              </Typography>
              <Typography variant="caption" color="gray">
                {user.role}
              </Typography>
            </Box>
            <Avatar
              alt={user.name}
              src={user.avatar}
              sx={{
                bgcolor: user.avatar ? "transparent" : "#3f3f5f",
                color: "#fff",
              }}
            >
              {!user.avatar && getInitial(user.name)}
            </Avatar>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
