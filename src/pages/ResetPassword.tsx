import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Paper,
    CircularProgress,
    InputAdornment,
    IconButton,
  } from "@mui/material";
  import { useState } from "react";
  import { useNavigate, useSearchParams } from "react-router-dom";
  import { Visibility, VisibilityOff } from "@mui/icons-material";
  import { toast } from "react-toastify";
  import api from "../api";
  
  const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
  
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const isStrongPassword = (pwd: string): boolean => {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pwd);
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!token) {
        toast.error("Invalid or missing reset token.");
        return;
      }
  
      if (!isStrongPassword(password)) {
        toast.error("Password must be 8+ chars, include uppercase, lowercase, number, and symbol.");
        return;
      }
  
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        return;
      }
  
      setLoading(true);
      try {
        await api.post(`/auth/reset-password/${token}`, { password });
        toast.success("Password has been reset. You can now login.");
        navigate("/login");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Reset failed");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Container maxWidth="sm" className="mt-20">
        <Paper elevation={6} className="bg-[#1e1e2f] text-white p-6 rounded-2xl shadow-lg">
          <Typography variant="h5" align="center" fontWeight={600}>
            Reset Your Password
          </Typography>
  
          <Box component="form" onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
            <TextField
              label="New Password"
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
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
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
              InputLabelProps={{ style: { color: "#ccc" } }}
              InputProps={{
                style: { color: "#fff" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  };
  
  export default ResetPassword;
  