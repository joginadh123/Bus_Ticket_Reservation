import React, { createContext, useContext, useState, useEffect } from "react";
// THIS IS THE FIX: Import 'api' and 'setAuthToken' from api.js
import { api, setAuthToken } from "../services/api.js"; 
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setAuthToken(token);
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser({
            id: decoded.userId,
            name: decoded.name,
            email: decoded.sub,
            role: decoded.role,
          });
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Failed to decode token", err);
        localStorage.removeItem("token");
      }
    }
    setIsAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // The 'api' object here is now correctly imported from api.js
      const res = await api.post("/users/login", { email, password });
      const { token } = res.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      
      const decoded = jwtDecode(token);
      const loggedInUser = {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.sub,
        role: decoded.role,
      };
      setUser(loggedInUser);
      return { ok: true, user: loggedInUser };
    } catch (err) {
      return { ok: false, error: err.response?.data || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      // This call also uses the correctly imported 'api' object
      await api.post("/users/register", { name, email, password, role });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  const value = { user, login, register, logout, loading, isAuthLoading };

  return (
    <AuthContext.Provider value={value}>
      {!isAuthLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);