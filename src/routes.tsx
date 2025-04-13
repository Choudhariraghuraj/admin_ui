import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import  Users from "./pages/Users";
import Settings from "./pages/Settings";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Layout from "./layouts/Layout";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
          element={<PrivateRoute><Layout /></PrivateRoute>}
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" index element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
                </Route>
    </Routes>
  );
};
