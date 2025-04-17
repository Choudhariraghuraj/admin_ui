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
  import { useTheme } from "@mui/material/styles";
  
  const ForgotPassword = () => {
    const theme = useTheme(); // Access the current theme
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
        <Paper
          elevation={6}
          className="p-6 rounded-2xl shadow-lg"
          sx={{
            backgroundColor: theme.palette.background.paper, // Dynamically apply background color
            color: theme.palette.text.primary, // Dynamically apply text color
          }}
        >
          <Typography
            variant="h5"
            align="center"
            fontWeight={600}
            sx={{ color: theme.palette.text.primary }} // Dynamic color for header
          >
            Forgot Password?
          </Typography>
  
          <Typography
            variant="body2"
            align="center"
            className="mt-1 mb-4"
            sx={{ color: theme.palette.text.secondary }} // Dynamic color for description text
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
              InputLabelProps={{
                style: { color: theme.palette.text.secondary }, // Dynamic color for input label
              }}
              InputProps={{
                style: { color: theme.palette.text.primary }, // Dynamic color for input text
              }}
            />
  
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              className="!py-3 font-bold"
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={{
                backgroundColor: theme.palette.primary.main, // Dynamic button background color
                color: theme.palette.primary.contrastText, // Dynamic button text color
              }}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </Box>
  
          <Typography
            variant="body2"
            align="center"
            sx={{
              color: theme.palette.primary.main, // Dynamic color for the link
              cursor: "pointer",
              transition: "color 0.3s",
              "&:hover": {
                color: theme.palette.primary.dark, // Hover effect color
              },
            }}
            className="mt-6"
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
  