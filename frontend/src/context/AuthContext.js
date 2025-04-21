import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/v1";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Set up axios defaults
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, []);

  useEffect(() => {
    // Check if user is logged in on component mount
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        console.error("Error parsing user data:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  const register = async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      return false;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      return false;
    }
  };

  const loginWithGoogle = async (credential) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google/verify`, {
        token: credential
      });

      const { token, user } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Google login failed");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateAuthState = (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        register,
        login,
        logout,
        loginWithGoogle,
        updateAuthState,
        setUser,
        setIsAuthenticated,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
