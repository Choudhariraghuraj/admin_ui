import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <ThemeContextProvider>
     <AuthProvider>
      <App />
    </AuthProvider>
    </ThemeContextProvider>
  </React.StrictMode>
);
