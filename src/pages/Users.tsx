import React, { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";

interface User {
  _id: string;
  name: string;
  email: string;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

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
    setFormData({ name: user.name, email: user.email, password: "" });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editUser) {
        await API.put(`/users/${editUser._id}`, formData);
        toast.success("User updated");
      } else {
        await API.post("/users", formData);
        toast.success("User added");
      }
      setModalOpen(false);
      setEditUser(null);
      setFormData({ name: "", email: "", password: "" });
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
            setFormData({ name: "", email: "", password: "" });
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
              <tr className="bg-blue-50 text-gray-600 text-sm">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-600 hover:underline"
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
                  <td colSpan={3} className="text-center text-gray-500 p-4">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {editUser ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Users;
