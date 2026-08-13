import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8097";

const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

// ==============================
// REGISTER
// ==============================

export const register = async (name, email, password) => {
  const response = await authClient.post("/api/auth/register", {
    name,
    email,
    password,
  });

  const data = response.data;

  // Save JWT
  localStorage.setItem("token", data.token);

  // Save user information
  localStorage.setItem(
    "user",
    JSON.stringify({
      userId: data.userId,
      name: data.name,
      email: data.email,
    })
  );

  return data;
};

// ==============================
// LOGIN
// ==============================

export const login = async (email, password) => {
  const response = await authClient.post("/api/auth/login", {
    email,
    password,
  });

  const data = response.data;

  // Save JWT
  localStorage.setItem("token", data.token);

  // Save user information
  localStorage.setItem(
    "user",
    JSON.stringify({
      userId: data.userId,
      name: data.name,
      email: data.email,
    })
  );

  return data;
};

// ==============================
// LOGOUT
// ==============================

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// ==============================
// GET TOKEN
// ==============================

export const getToken = () => {
  return localStorage.getItem("token");
};

// ==============================
// GET CURRENT USER
// ==============================

export const getCurrentUser = () => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

// ==============================
// CHECK LOGIN
// ==============================

export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};