import React, { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { Modal } from "@mui/material";

interface User {
  _id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    avatar: null as File | null,
    role: "user",
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/users");
      setUsers(res.data.users);
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      toast.error("Save failed");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">👥 User Management</h1>
        <button
          onClick={() => {
            setEditUser(null);
            setFormData({ name: "", email: "", password: "", role: "user", avatar: null });
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          ➕ Add User
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <ClipLoader color="#2563EB" />
        </div>
      ) : (
        <div className="overflow-auto bg-white shadow rounded-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#1e1e2f] text-white text-sm">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-white hover:underline"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="text-red-500 hover:underline"
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users?.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 p-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal without animation */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="flex justify-center items-center min-h-screen">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl space-y-4"
          >
            <h2 className="text-lg font-semibold">{editUser ? "Edit User" : "Add User"}</h2>
            <input
              type="text"
              placeholder="Name"
              className="w-full border p-2 rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            {!editUser && (
              <input
                type="password"
                placeholder="Password"
                className="w-full border p-2 rounded"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            )}

            {/* Role Selection */}
            <div className="w-full">
              <label className="block text-sm mb-2">Role</label>
              <select
                className="w-full border p-2 rounded"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <input
              type="file"
              className="w-full border p-2 rounded"
              onChange={(e) => setFormData({ ...formData, avatar: e.target.files ? e.target.files[0] : null })}
            />

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-red rounded cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white rounded"
              >
                {editUser ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
