import React, { useEffect, useState } from "react";
import api from "../api";
import { toast } from "react-toastify";
import { Paper, Grid, Typography, Avatar, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from '@mui/material/styles';

interface OverviewData {
  totalUsers: number;
  adminUsers: number;
  normalUsers: number;
  recentUsers: any[];
  currentUser: { role: string; name: string; email: string; avatar?: string };
}

const Home: React.FC = () => {
  const theme = useTheme(); // Access the current theme
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

  if (loading || !data) return <p style={{ color: theme.palette.text.primary }} className="p-6">Loading dashboard...</p>;

  const isAdmin = data.currentUser.role === "admin";

  const chartData = [
    { name: "Admins", value: data.adminUsers },
    { name: "Users", value: data.normalUsers },
  ];

  return (
    <div className="p-6 w-full" style={{ color: theme.palette.text.primary }}>
      <Typography variant="h4" className="mb-6 font-semibold" style={{ color: theme.palette.text.primary }}>
        Welcome, {data.currentUser.name}
      </Typography>

      <Grid container spacing={3} className="pt-6">
        {isAdmin ? (
          <>
            {/* Admin View */}
            <Grid size={12}>
              <Paper className="p-4" style={{ backgroundColor: theme.palette.background.paper }}>
                <Typography variant="h6" style={{ color: theme.palette.text.primary }}>Total Users</Typography>
                <Typography variant="h4" style={{ color: theme.palette.info.main }}>{data.totalUsers}</Typography>
              </Paper>
            </Grid>
            <Grid size={12}>
              <Paper className="p-4" style={{ backgroundColor: theme.palette.background.paper }}>
                <Typography variant="h6" style={{ color: theme.palette.text.primary }}>Admins</Typography>
                <Typography variant="h4" style={{ color: theme.palette.success.main }}>{data.adminUsers}</Typography>
              </Paper>
            </Grid>
            <Grid size={12}>
              <Paper className="p-4" style={{ backgroundColor: theme.palette.background.paper }}>
                <Typography variant="h6" style={{ color: theme.palette.text.primary }}>Normal Users</Typography>
                <Typography variant="h4" style={{ color: theme.palette.warning.main }}>{data.normalUsers}</Typography>
              </Paper>
            </Grid>

            <Grid size={12}>
              <Paper className="p-4 h-64" style={{ backgroundColor: theme.palette.background.paper }}>
                <Typography variant="h6" className="mb-3" style={{ color: theme.palette.text.primary }}>User Role Chart</Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke={theme.palette.text.secondary} />
                    <YAxis stroke={theme.palette.text.secondary} />
                    <Tooltip />
                    <Bar dataKey="value" fill={theme.palette.primary.main} radius={[5, 5, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            <Grid size={12}>
              <Paper className="p-4" style={{ backgroundColor: theme.palette.background.paper }}>
                <Typography variant="h6" className="mb-3" style={{ color: theme.palette.text.primary }}>Recent Users</Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ color: theme.palette.text.primary }}>Avatar</TableCell>
                        <TableCell style={{ color: theme.palette.text.primary }}>Name</TableCell>
                        <TableCell style={{ color: theme.palette.text.primary }}>Email</TableCell>
                        <TableCell style={{ color: theme.palette.text.primary }}>Role</TableCell>
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
                          <TableCell style={{ color: theme.palette.text.primary }}>{u.name}</TableCell>
                          <TableCell style={{ color: theme.palette.text.primary }}>{u.email}</TableCell>
                          <TableCell style={{ color: theme.palette.text.primary }} className="capitalize">{u.role}</TableCell>
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
              <Paper className="p-4" style={{ backgroundColor: theme.palette.background.paper }}>
                <Typography variant="h6" className="mb-3" style={{ color: theme.palette.text.primary }}>
                  Your Profile Overview
                </Typography>
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
                    <Typography style={{ color: theme.palette.text.primary }} className="text-lg">
                      {data.currentUser.name}
                    </Typography>
                    <Typography style={{ color: theme.palette.text.secondary }} className="text-sm">
                      {data.currentUser.email}
                    </Typography>
                    <Typography
                      style={{
                        color: data.currentUser.role === 'admin' 
                          ? theme.palette.success.main 
                          : theme.palette.info.main,
                      }}
                      className="text-sm"
                    >
                      Role: {data.currentUser.role}
                    </Typography>
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
