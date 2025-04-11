import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
    <CssBaseline />
     <AuthProvider>
      <App />
    </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
