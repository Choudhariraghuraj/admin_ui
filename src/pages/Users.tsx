import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  Modal,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import API from "../api";
import { getAvatarUrl } from "../utils/avatarUrl";
import { useAuth } from "../context/AuthContext";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

const Users = () => {
  const { user } = useAuth(); // Get current logged-in user
  const isAdmin = user?.role === "admin"; // Check role
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    avatar: null as File | null,
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data.users);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure to delete this user?")) return;
    try {
      await API.delete(`/users/${id}`);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (user: User) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      avatar: null,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("role", formData.role);
    if (formData.avatar) formDataToSend.append("avatar", formData.avatar);

    try {
      if (editUser) {
        await API.put(`/users/${editUser._id}`, formDataToSend);
        toast.success("User updated");
      } else {
        await API.post("/users", formDataToSend);
        toast.success("User added");
      }
      setModalOpen(false);
      setEditUser(null);
      setFormData({ name: "", email: "", password: "", role: "user", avatar: null });
      fetchUsers();
    } catch {
      toast.error("Save failed");
    }
  };

  return (
    <div className="w-full px-6 py-6 bg-[#2c2c3e] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">👥 User Management</h1>
        {isAdmin && ( <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setEditUser(null);
            setFormData({ name: "", email: "", password: "", role: "user", avatar: null });
            setModalOpen(true);
          }}
        >
          ➕ Add User
        </Button> )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <CircularProgress color="primary" />
        </div>
      ) : (
        <TableContainer className="bg-[#1e1e2f] rounded-xl shadow-md overflow-auto">
          <Table>
            <TableHead>
              <TableRow className="bg-[#1e1e2f] text-white text-sm">
                <TableCell className="text-white">Name</TableCell>
                <TableCell className="text-white">Email</TableCell>
                <TableCell className="text-white">Role</TableCell>
                <TableCell className="text-white">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user._id} className="border-b hover:bg-[#2c2c3e] transition">
                  <TableCell className="text-white">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar ? getAvatarUrl(user.avatar) : ""}
                        alt={user.name}
                        sx={{ width: 32, height: 32, bgcolor: "#3f3f5f" }}
                      >
                        {!user.avatar && user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-white">{user.email}</TableCell>
                  <TableCell className="text-white capitalize">{user.role}</TableCell>
                  <TableCell>
                  {isAdmin ? (
                <> <Button onClick={() => handleEdit(user)} color="secondary" variant="text">
                      ✏️ Edit
                    </Button>
                    <Button onClick={() => handleDelete(user._id)} color="error" variant="text">
                      🗑 Delete
                    </Button>
                    </>
                     ) : (
                      <span className="text-gray-400 italic">Restricted</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 p-4">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex justify-center items-center min-h-screen">
          <form
            onSubmit={handleSubmit}
            className="bg-[#1e1e2f] p-6 rounded-xl w-full max-w-md shadow-xl"
          >
            <Grid container spacing={2}>
              <Grid size={12}>
                <h2 className="text-lg font-semibold text-white">
                  {editUser ? "Edit User" : "Add User"}
                </h2>
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Name"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#ccc" } }}
                />
              </Grid>

              <Grid size={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  InputProps={{ style: { color: "#fff" } }}
                  InputLabelProps={{ style: { color: "#ccc" } }}
                />
              </Grid>

              {!editUser && (
                <Grid size={12}>
                  <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    InputProps={{ style: { color: "#fff" } }}
                    InputLabelProps={{ style: { color: "#ccc" } }}
                  />
                </Grid>
              )}

              <Grid size={12}>
                <Select
                  fullWidth
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as string })
                  }
                  displayEmpty
                  variant="outlined"
                  sx={{ color: "#fff", bgcolor: "#2c2c3e" }}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </Grid>

              <Grid size={12}>
                <TextField
                  type="file"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ accept: "image/*" }}
                  onChange={(e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    setFormData({ ...formData, avatar: file ?? null });
                  }}
                />
              </Grid>

              <Grid size={12} className="flex justify-end gap-4">
                <Button variant="outlined" color="error" onClick={() => setModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {editUser ? "Update" : "Create"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
