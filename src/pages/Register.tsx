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
import { styled } from "@mui/system";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
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
      navigate("/login"); //
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <Container maxWidth="sm" className="mt-20">
      <Paper elevation={6} className="bg-[#1e1e2f] text-white p-6 rounded-2xl shadow-lg">
        <Typography variant="h5" align="center" fontWeight={600}>
          Create New Account
        </Typography>

        <Box component="form" onSubmit={handleRegister} className="mt-6 flex flex-col gap-5">
          <TextField
            label="Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ input: { color: "#fff" }, "& .MuiInputLabel-root": { color: "#ccc" } }}
          />

          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ input: { color: "#fff" }, "& .MuiInputLabel-root": { color: "#ccc" } }}
          />

          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ input: { color: "#fff" }, "& .MuiInputLabel-root": { color: "#ccc" } }}
            InputProps={{
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
            sx={{ input: { color: "#fff" }, "& .MuiInputLabel-root": { color: "#ccc" } }}
            InputProps={{
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
            sx={{ input: { color: "#ccc" }, "& .MuiInputLabel-root": { color: "#ccc" } }}
            InputProps={{
              inputProps: { accept: "image/*" },
            }}
            InputLabelProps={{ shrink: true }}
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
            {loading ? "Registering..." : "Register"}
          </Button>

          <Typography variant="body2" align="center" className="text-gray-400 mt-2">
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              className="text-blue-400 hover:text-blue-300 font-medium"
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
