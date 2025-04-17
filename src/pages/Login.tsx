import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Link,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Login = () => {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const remembered = localStorage.getItem("remember") === "true";
    if (remembered) {
      setEmail(localStorage.getItem("rememberEmail") || "");
      setPassword(localStorage.getItem("rememberPassword") || "");
      setRemember(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password, remember });

      if (remember) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("remember", "true");
        localStorage.setItem("rememberEmail", email);
        localStorage.setItem("rememberPassword", password);
      } else {
        sessionStorage.setItem("token", res.data.token);
        localStorage.removeItem("remember");
        localStorage.removeItem("rememberEmail");
        localStorage.removeItem("rememberPassword");
      }

      login(res.data.token, res.data.user);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Paper
        elevation={6}
        sx={{
          p: 6,
          borderRadius: 3,
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
        }}
      >
        <Typography variant="h5" align="center" fontWeight={600}>
          Login to Your Account
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <FormControlLabel
              control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
              label="Remember me"
            />

            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="hover"
              variant="body2"
              color="primary"
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, fontWeight: "bold" }}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 1 }}>
            Don’t have an account?{" "}
            <Link component={RouterLink} to="/register" underline="hover" color="primary" fontWeight="medium">
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
