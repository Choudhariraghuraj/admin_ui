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
  import { useTheme } from "@mui/material/styles";
  
  const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");
  
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
  
    const theme = useTheme(); // Access the current theme
  
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
        <Paper
          elevation={6}
          sx={{
            backgroundColor: theme.palette.background.paper, // Dynamic background color based on theme
            color: theme.palette.text.primary, // Dynamic text color based on theme
            p: 6,
            borderRadius: "16px",
            boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight={600}
            sx={{ color: theme.palette.text.primary }} // Dynamic header color
          >
            Reset Your Password
          </Typography>
  
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 6, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="New Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{
                sx: { color: theme.palette.text.secondary }, // Dynamic label color
              }}
              InputProps={{
                sx: { color: theme.palette.text.primary }, // Dynamic input text color
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
              InputLabelProps={{
                sx: { color: theme.palette.text.secondary }, // Dynamic label color
              }}
              InputProps={{
                sx: { color: theme.palette.text.primary }, // Dynamic input text color
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
              sx={{
                py: 2, // Padding vertical
                fontWeight: "bold",
                color: theme.palette.primary.contrastText, // Dynamic button text color
                backgroundColor: theme.palette.primary.main, // Dynamic background color
              }}
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
  