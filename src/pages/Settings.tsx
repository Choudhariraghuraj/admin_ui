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

      // Update user data in context after successful update
      if (response.data) {
        updateUser(response.data); // Update user in context
      }
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
      <Paper className="bg-[#1e1e2f] p-6 text-white rounded-xl shadow-md">
        <h1 className="text-2xl font-semibold mb-4 text-white">Profile Settings</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                label="Name"
                fullWidth
                {...register("name")}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register("email")}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{ style: { color: "#fff" } }}
              />
            </Grid>

            <Grid size={6}>
              <TextField
                label="Current Password"
                type={showCurrentPassword ? "text" : "password"}
                fullWidth
                {...register("currentPassword")}
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{
                  style: { color: "#fff" },
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
                InputLabelProps={{ style: { color: "#ccc" } }}
                InputProps={{
                  style: { color: "#fff" },
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
                InputProps={{
                  classes: {
                    root: "bg-[#1e1e2f]",
                    input:
                      "text-white file:text-white file:bg-[#2c2c3d] file:border-0 file:rounded file:mr-2 file:py-1 file:px-3",
                  },
                }}
              />
            </Grid>

            {preview && (
              <Grid size={12}>
                <div className="mt-3">
                  <img
                    src={preview}
                    alt="Avatar Preview"
                    className="w-24 h-24 rounded-full border border-white object-cover"
                  />
                </div>
              </Grid>
            )}

            <Grid size={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={submitting}
                className="!bg-[#1e1e2f] !text-white hover:!bg-[#2a2a3d] transition-colors font-medium py-3"
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
