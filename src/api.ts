// src/api.ts
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api` || "https://admin-api-hlyn.onrender.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
