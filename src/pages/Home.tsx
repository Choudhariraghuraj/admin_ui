import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Paper,
  Typography,
  Grid,
  Avatar,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Spinner from "../components/Spinner";

interface DashboardData {
  totalUsers: number;
  totalAdmins: number;
  usersToday: number;
  userStats: { date: string; count: number }[];
  recentUsers: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    createdAt: string;
  }[];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get("/dashboard/overview");
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  if (loading || !data) return <Spinner />;

  return (
    <div className="p-6 space-y-6">
      {/* Stat Cards */}
      <Grid container spacing={3}>
        {[
          { title: "Total Users", value: data.totalUsers },
          { title: "Total Admins", value: data.totalAdmins },
          { title: "Today's Signups", value: data.usersToday },
        ].map((stat, idx) => (
          <Grid size={12} key={idx}>
            <Paper className="bg-[#1e1e2f] p-4 text-white rounded-lg shadow">
              <Typography variant="h6">{stat.title}</Typography>
              <Typography variant="h4" className="mt-2 font-bold">
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Area Chart */}
      <Paper className="bg-[#1e1e2f] p-6 rounded-lg shadow text-white">
        <Typography variant="h6" gutterBottom>
          User Growth
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data.userStats}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Paper>

      {/* Recent Users Table */}
      <Paper className="bg-[#1e1e2f] p-6 rounded-lg shadow text-white">
        <Typography variant="h6" gutterBottom>
          Recent Users
        </Typography>
        <Table className="text-white">
          <TableHead>
            <TableRow>
              <TableCell className="text-white">Avatar</TableCell>
              <TableCell className="text-white">Name</TableCell>
              <TableCell className="text-white">Email</TableCell>
              <TableCell className="text-white">Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.recentUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>
                  <Avatar
                    src={
                      user.avatar
                        ? import.meta.env.VITE_API_BASE_URL + user.avatar
                        : undefined
                    }
                    alt={user.name}
                  />
                </TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
};

export default Dashboard;
