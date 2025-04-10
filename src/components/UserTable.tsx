import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const UserTable = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Simulating fetching data from API
    setUsers([
      { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
      { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    ]);
  }, []);

  const columns: GridColDef[] = [
    { field: "name", headerName: "Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "role", headerName: "Role", width: 150 },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={users} columns={columns} />
    </div>
  );
};
