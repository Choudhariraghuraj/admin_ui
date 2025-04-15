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
  import { toast } from "react-toastify";
  import api from "../api";
  import { Link as RouterLink } from "react-router-dom";
  
  const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      setLoading(true);
      try {
        await api.post("/auth/forgot-password", { email });
        toast.success("If that email is registered, a reset link has been sent.");
        setEmail("");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Container maxWidth="sm" className="mt-20">
        <Paper elevation={6} className="bg-[#1e1e2f] text-white p-6 rounded-2xl shadow-lg">
          <Typography variant="h5" align="center" fontWeight={600}>
            Forgot Password?
          </Typography>
  
          <Typography
            variant="body2"
            align="center"
            className="text-gray-400 mt-1 mb-4"
          >
            Enter your email and we’ll send you a link to reset your password.
          </Typography>
  
          <Box component="form" onSubmit={handleSubmit} className="mt-4 flex flex-col gap-5">
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
  
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              className="!py-3 font-bold text-white"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </Box>
  
          <Typography
            variant="body2"
            align="center"
            className="text-blue-400 hover:text-blue-300 mt-6"
          >
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              data-testid="go-back-login"
            >
              Remembered your password? Go back to login
            </Link>
          </Typography>
        </Paper>
      </Container>
    );
  };
  
  export default ForgotPassword;
  