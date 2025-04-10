import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import  Users from "./pages/Users";
import Settings from "./pages/Settings";
import { PrivateRoute } from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
          path="/*"
          element={
            <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
            </PrivateRoute>
          }
        />
    </Routes>
  );
};
