import React, { useEffect, useState, useMemo } from "react";
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
  useTheme,
  Paper,
  Pagination,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import API from "../api";
import { getAvatarUrl } from "../utils/avatarUrl";
import { useAuth } from "../context/AuthContext";
import SearchIcon from "@mui/icons-material/Search";

interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

const Users = () => {
  const pageLimit = 5;
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const theme = useTheme();

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

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  // 🧠 Memoized query parameters to reduce full component re-renders
  const queryParams = useMemo(() => ({ page, search, role: roleFilter, limit: pageLimit }), [page, search, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users", { params: queryParams });
      setUsers(res.data.users);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [queryParams]);

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
    <div
      style={{
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      {/* 🔍 Filters and Add */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">👥 User Management</h1>

        <div className="flex gap-2 flex-wrap">
          <TextField
            size="small"
            placeholder="Search name/email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Select
            size="small"
            value={roleFilter}
            displayEmpty
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="user">User</MenuItem>
          </Select>

          {isAdmin && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setEditUser(null);
                setFormData({ name: "", email: "", password: "", role: "user", avatar: null });
                setModalOpen(true);
              }}
            >
              ➕ Add User
            </Button>
          )}
        </div>
      </div>

      {/* 📋 User Table */}
      <TableContainer
        component={Paper}
        elevation={4}
        key={`${page}-${search}-${roleFilter}`}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <CircularProgress color="primary" />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user.avatar ? getAvatarUrl(user.avatar) : ""}
                        alt={user.name}
                      >
                        {!user.avatar && user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      {user.name}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">{user.role}</TableCell>
                  <TableCell>
                    {isAdmin ? (
                      <>
                        <Button onClick={() => handleEdit(user)} color="secondary" variant="text">
                          ✏️ Edit
                        </Button>
                        <Button onClick={() => handleDelete(user._id)} color="error" variant="text">
                          🗑 Delete
                        </Button>
                      </>
                    ) : (
                      <span style={{ color: theme.palette.text.disabled }}>Restricted</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
            {users.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📄 Pagination */}
      <div className="flex justify-center mt-4">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </div>

      {/* 🧾 Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="flex justify-center items-center min-h-screen px-4">
          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              padding: 24,
              borderRadius: 16,
              maxWidth: 500,
              width: "100%",
            }}
          >
            <Grid container spacing={2}>
              <Grid size={12}>
                <h2 className="text-lg font-semibold">{editUser ? "Edit User" : "Add User"}</h2>
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Name"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  />
                </Grid>
              )}
              <Grid size={12}>
                <Select
                  fullWidth
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
