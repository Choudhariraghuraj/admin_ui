import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { Paper, Grid, Typography, Avatar, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface OverviewData {
  totalUsers: number;
  adminUsers: number;
  normalUsers: number;
  recentUsers: any[];
  currentUser: { role: string; name: string; email: string; avatar?: string };
}

const Home: React.FC = () => {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get("/dashboard/overview");
        setData(res.data);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading || !data) return <p className="text-white p-6">Loading dashboard...</p>;

  const isAdmin = data.currentUser.role === "admin";

  const chartData = [
    { name: "Admins", value: data.adminUsers },
    { name: "Users", value: data.normalUsers },
  ];

  return (
    <div className="p-6 text-white w-full">
      <Typography variant="h4" className="mb-6 font-semibold text-white">
        Welcome, {data.currentUser.name}
      </Typography>

      <Grid container spacing={3} className="pt-6">
        {isAdmin ? (
          <>
            {/* Admin View */}
            <Grid size={12}>
              <Paper className="bg-[#1e1e2f] p-4">
                <Typography variant="h6" className="text-white">Total Users</Typography>
                <Typography variant="h4" className="text-blue-400">{data.totalUsers}</Typography>
              </Paper>
            </Grid>
            <Grid size={12}>
              <Paper className="bg-[#1e1e2f] p-4">
                <Typography variant="h6" className="text-white">Admins</Typography>
                <Typography variant="h4" className="text-green-400">{data.adminUsers}</Typography>
              </Paper>
            </Grid>
            <Grid size={12}>
              <Paper className="bg-[#1e1e2f] p-4">
                <Typography variant="h6" className="text-white">Normal Users</Typography>
                <Typography variant="h4" className="text-yellow-400">{data.normalUsers}</Typography>
              </Paper>
            </Grid>

            <Grid size={12}>
              <Paper className="bg-[#1e1e2f] p-4 h-64">
                <Typography variant="h6" className="mb-3 text-white">User Role Chart</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#ccc" />
                    <YAxis stroke="#ccc" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid size={12}>
  <Paper className="bg-[#1e1e2f] p-4">
    <Typography variant="h6" className="mb-3 text-white">Recent Users</Typography>
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className="text-white">Avatar</TableCell>
            <TableCell className="text-white">Name</TableCell>
            <TableCell className="text-white">Email</TableCell>
            <TableCell className="text-white">Role</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.recentUsers.map((u) => (
            <TableRow key={u._id}>
              <TableCell>
                <Avatar
                  src={
                    u.avatar
                      ? import.meta.env.VITE_API_BASE_URL + u.avatar
                      : "/default-avatar.png"
                  }
                  alt={u.name}
                  sx={{ width: 32, height: 32 }}
                />
              </TableCell>
              <TableCell className="text-white">{u.name}</TableCell>
              <TableCell className="text-white">{u.email}</TableCell>
              <TableCell className="text-white capitalize">{u.role}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
</Grid>
          </>
        ) : (
          <>
            {/* User View */}
            <Grid size={12}>
              <Paper className="bg-[#1e1e2f] p-4">
                <Typography variant="h6" className="mb-3 text-white">Your Profile Overview</Typography>
                <div className="flex items-center gap-4">
                  <Avatar
                    src={
                      data.currentUser.avatar
                        ? import.meta.env.VITE_API_BASE_URL + data.currentUser.avatar
                        : "/default-avatar.png"
                    }
                    alt={data.currentUser.name}
                    sx={{ width: 60, height: 60 }}
                  />
                  <div>
                    <Typography className="text-white text-lg">{data.currentUser.name}</Typography>
                    <Typography className="text-sm text-gray-400">{data.currentUser.email}</Typography>
                    <Typography className="text-sm text-green-400">Role: {data.currentUser.role}</Typography>
                  </div>
                </div>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </div>
  );
};

export default Home;
