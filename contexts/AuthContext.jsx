"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/services/api";
import { toast } from "@/components/ui";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged in user profile using the JWT token
  const loadUserProfile = async (token) => {
    try {
      if (token) {
        localStorage.setItem("token", token);
      }
      const res = await api.get("/api/auth/me");
      if (res.data && res.data.success) {
        setUser(res.data.user);
      } else {
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      // 1. Check for token in URL query string (redirected by Google OAuth callback)
      const params = new URLSearchParams(window.location.search);
      const tokenFromUrl = params.get("token");

      if (tokenFromUrl) {
        localStorage.setItem("token", tokenFromUrl);
        // Clean query parameter from address bar
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        await loadUserProfile(tokenFromUrl);
      } else {
        // 2. Check for token in localStorage
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
          await loadUserProfile(storedToken);
        } else {
          setLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  // Email/Password login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      if (res.data && res.data.success) {
        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);
        toast.success("Welcome back! Logged in successfully.");
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Invalid email or password";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Account registration
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/api/auth/register", { name, email, password });
      if (res.data && res.data.success) {
        toast.success("Account registered successfully! Please log in.");
        return { success: true };
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Try again.";
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Sign out user
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Logged out successfully.");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        loadUser: loadUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
