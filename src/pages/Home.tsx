// src/pages/Home.tsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", users: 30 },
  { name: "Feb", users: 45 },
  { name: "Mar", users: 70 },
  { name: "Apr", users: 50 },
];

const Home = () => {
  return (
    <div className="w-full h-full">
      <h2 className="text-2xl font-bold mb-4">📊 Dashboard Overview</h2>
      <div className="w-full h-[300px] bg-white p-4 rounded-2xl shadow-md">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Home;
