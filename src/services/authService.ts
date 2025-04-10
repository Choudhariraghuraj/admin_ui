// src/services/authService.ts
import API from "../api";

export const loginUser = (email: string, password: string) => {
  return API.post("/auth/login", { email, password });
};

export const registerUser = (name: string, email: string, password: string) => {
  return API.post("/auth/register", { name, email, password });
};
