import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
<<<<<<< HEAD
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const userData = { email, token: response.data.token };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Save user to localStorage

      return { success: true, message: response.data.message };
=======
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      if (res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate("/chat");
      }
>>>>>>> 58e0dd3ea758086083fe3a3060a268196ced1986
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || "Login failed",
      };
    }
  };

<<<<<<< HEAD
  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove user from localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
=======
  return (
    <AuthContext.Provider value={{ user, login }}>
>>>>>>> 58e0dd3ea758086083fe3a3060a268196ced1986
      {children}
    </AuthContext.Provider>
  );
};
