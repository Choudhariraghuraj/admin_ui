import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled, useTheme } from "@mui/material/styles";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: "transparent",
  },
  "&:focus": {
    outline: "none",
  },
  "&:active": {
    outline: "none",
  },
}));

const Register = () => {
  const theme = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isStrongPassword = (pwd: string): boolean => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;
    return regex.test(pwd);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStrongPassword(password)) {
      toast.error("Password must be 8+ characters, include uppercase, lowercase, number & symbol.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (avatar) formData.append("avatar", avatar);

    try {
      await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Account created successfully! Please log in.");
      navigate("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Container maxWidth="sm" className="mt-20">
      <Paper
        elevation={6}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          p: 6,
          borderRadius: 4,
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
        }}
      >
        <Typography variant="h5" align="center" fontWeight={600} sx={{ color: theme.palette.text.primary }}>
          Create New Account
        </Typography>

        <Box component="form" onSubmit={handleRegister} sx={{ mt: 6, display: "flex", flexDirection: "column", gap: 2.5 }}>
          <TextField
            label="Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
            InputProps={{ sx: { color: theme.palette.text.primary } }}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
            InputProps={{ sx: { color: theme.palette.text.primary } }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
            InputProps={{
              sx: { color: theme.palette.text.primary },
              endAdornment: (
                <InputAdornment position="end">
                  <StyledIconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </StyledIconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Confirm Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputLabelProps={{ sx: { color: theme.palette.text.secondary } }}
            InputProps={{
              sx: { color: theme.palette.text.primary },
              endAdornment: (
                <InputAdornment position="end">
                  <StyledIconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </StyledIconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            type="file"
            fullWidth
            onChange={(e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              setAvatar(file ?? null);
            }}
            InputLabelProps={{ shrink: true, sx: { color: theme.palette.text.secondary } }}
            InputProps={{
              inputProps: { accept: "image/*" },
              sx: { color: theme.palette.text.secondary },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.5,
              fontWeight: "bold",
              color: theme.palette.primary.contrastText,
              backgroundColor: theme.palette.primary.main,
            }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Registering..." : "Register"}
          </Button>

          <Typography variant="body2" align="center" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
