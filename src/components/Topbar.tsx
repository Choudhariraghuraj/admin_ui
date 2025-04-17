import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
  Tooltip,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAuth } from "../context/AuthContext";
import { getAvatarUrl } from "../utils/avatarUrl";
import { useThemeContext } from "../context/ThemeContext";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const theme = useTheme();
  const { mode, toggleColorMode } = useThemeContext();
  const { user } = useAuth();

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        zIndex: 1201,
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar>
        <IconButton color="inherit" edge="start" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1 }} />

        <Tooltip title={`Switch to ${mode === "dark" ? "light" : "dark"} mode`}>
          <IconButton onClick={toggleColorMode} color="inherit">
            {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {user && (
          <Box display="flex" alignItems="center" gap={2} ml={2}>
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                {user.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.role}
              </Typography>
            </Box>
            <Avatar
  alt={user.name}
  src={user.avatar ? getAvatarUrl(user.avatar) : ""}
  sx={{
    bgcolor: user.avatar
      ? "transparent"
      : theme.palette.mode === "dark"
        ? theme.palette.grey[700]
        : theme.palette.grey[300],
    color: user.avatar
      ? "inherit"
      : theme.palette.mode === "dark"
        ? theme.palette.getContrastText(theme.palette.grey[700])
        : theme.palette.getContrastText(theme.palette.grey[300]),
  }}
>
  {!user.avatar && getInitial(user?.name ?? "")}
</Avatar>

          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
