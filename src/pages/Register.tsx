import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Link
} from "@mui/material";
import { useState } from "react";
import {  Link as RouterLink, useNavigate } from "react-router-dom";
import api from "../api";
import { toast } from "react-toastify";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", { name, email, password });
      localStorage.setItem("token", res.data.token);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center">
          Create New Account
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 2 }}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
             <Typography variant="body2" align="center" sx={{ mt: 2 }}>
      Already have an account?{" "}
      <Link component={RouterLink} to="/login">
        Login
      </Link>
    </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
