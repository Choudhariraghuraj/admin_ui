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
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { styled } from "@mui/system";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  // 🔁 Prefill if remember me data exists
  useEffect(() => {
    const remembered = localStorage.getItem("remember") === "true";
    if (remembered) {
      const storedEmail = localStorage.getItem("rememberEmail") || "";
      const storedPassword = localStorage.getItem("rememberPassword") || "";
      setEmail(storedEmail);
      setPassword(storedPassword);
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

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Container maxWidth="sm" className="mt-20">
      <Paper elevation={6} className="bg-[#1e1e2f] text-white p-6 rounded-2xl shadow-lg">
        <Typography variant="h5" align="center" fontWeight={600}>
          Login to Your Account
        </Typography>

        <Box component="form" onSubmit={handleLogin} className="mt-6 flex flex-col gap-5">
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{
              style: { color: "#fff" },
              endAdornment: (
                <InputAdornment position="end">
                  <StyledIconButton onClick={handleClickShowPassword} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </StyledIconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box className="flex justify-between items-center">
            <FormControlLabel
              control={
                <Checkbox
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  sx={{ color: "#ccc" }}
                />
              }
              label="Remember me"
              sx={{ color: "#ccc" }}
            />

            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="hover"
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Forgot Password?
            </Link>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            className="!py-3 font-bold text-white"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

          <Typography variant="body2" align="center" className="text-gray-400 mt-2">
            Don’t have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="hover"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
