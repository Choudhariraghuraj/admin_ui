import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import api from "../api";
import Spinner from "../components/Spinner";
import {
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper,
  Grid,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { getAvatarUrl } from "../utils/avatarUrl";

interface ProfileForm {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  avatar?: FileList;
}

const Settings: React.FC = () => {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    user?.avatar ? getAvatarUrl(user.avatar) : null
  );
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setNewShowPassword] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm<ProfileForm>();
  const avatarWatch = watch("avatar");

  useEffect(() => {
    if (user) {
      reset({ name: user.name, email: user.email });
    }
  }, [user, reset]);

  useEffect(() => {
    if (avatarWatch && avatarWatch[0]) {
      const file = avatarWatch[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [avatarWatch]);

  const onSubmit = async (formData: ProfileForm) => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("email", formData.email);
    if (formData.currentPassword) fd.append("currentPassword", formData.currentPassword);
    if (formData.newPassword) fd.append("newPassword", formData.newPassword);
    if (formData.avatar && formData.avatar[0]) {
      fd.append("avatar", formData.avatar[0]);
    }

    try {
      setSubmitting(true);
      const response = await api.put("/users/me", fd);
      toast.success("Profile updated!");
      if (response.data) updateUser(response.data);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return <Spinner />;

  return (
    <motion.div
      className="p-6 mx-auto w-full animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Paper
        elevation={4}
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          padding: 24,
          borderRadius: 16,
        }}
      >
        <h1 className="text-2xl font-semibold mb-4">Profile Settings</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Name"
                fullWidth
                {...register("name")}
                InputLabelProps={{
                  style: { color: theme.palette.text.secondary },
                }}
                InputProps={{
                  style: { color: theme.palette.text.primary },
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register("email")}
                InputLabelProps={{
                  style: { color: theme.palette.text.secondary },
                }}
                InputProps={{
                  style: { color: theme.palette.text.primary },
                }}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                fullWidth
                {...register("currentPassword")}
                InputLabelProps={{
                  style: { color: theme.palette.text.secondary },
                }}
                InputProps={{
                  style: { color: theme.palette.text.primary },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                        {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                label="New Password"
                type={showNewPassword ? "text" : "password"}
                fullWidth
                {...register("newPassword")}
                InputLabelProps={{
                  style: { color: theme.palette.text.secondary },
                }}
                InputProps={{
                  style: { color: theme.palette.text.primary },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setNewShowPassword(!showNewPassword)}>
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                type="file"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                inputProps={{ accept: "image/*" }}
                {...register("avatar")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </Grid>

            {preview && (
              <Grid size={12}>
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full border object-cover"
                    style={{ borderColor: theme.palette.divider }}
                  />
                </div>
              </Grid>
            )}

            <Grid size={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </motion.div>
  );
};

export default Settings;
