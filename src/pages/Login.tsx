import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Link,
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login method

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      login(res.data.token, res.data.user); // Store token + user
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "#ccc" } }}
            InputProps={{ style: { color: "#fff" } }}
          />

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
