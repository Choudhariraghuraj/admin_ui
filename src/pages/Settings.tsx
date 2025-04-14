import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import api from "../api";
import Spinner from "../components/Spinner";

interface ProfileForm {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  avatar?: FileList;
}

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<ProfileForm>();

  const avatarWatch = watch("avatar");

  // Preview avatar
  useEffect(() => {
    if (avatarWatch && avatarWatch[0]) {
      const file = avatarWatch[0];
      setPreview(URL.createObjectURL(file));
    }
  }, [avatarWatch]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/users/me");
        reset(data);
        setPreview(data.avatar ? import.meta.env.VITE_API_BASE_URL + data.avatar : null);
      } catch (err: any) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

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
      await api.put("/users/me", fd);
      toast.success("Profile updated!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <motion.div
      className="p-6 max-w-2xl mx-auto w-full animate-fade-in"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-2xl font-semibold mb-4">Profile Settings</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input {...register("name")} className="input" />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input {...register("email")} type="email" className="input" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Current Password</label>
            <input {...register("currentPassword")} type="password" className="input" />
          </div>
          <div>
            <label className="block text-sm font-medium">New Password</label>
            <input {...register("newPassword")} type="password" className="input" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Avatar</label>
          <input {...register("avatar")} type="file" accept="image/*" />
        </div>

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Avatar Preview"
              className="w-24 h-24 object-cover rounded-full border"
            />
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </motion.div>
  );
};

export default Settings;
