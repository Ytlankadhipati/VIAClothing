import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.data.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("via_token");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success) {
      if (res.token) {
        localStorage.setItem("via_token", res.token);
      }
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || "Failed to login");
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success) {
      if (res.token) {
        localStorage.setItem("via_token", res.token);
      }
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || "Failed to register");
  };

  const googleLogin = async (idToken) => {
    const res = await authService.googleAuth(idToken);
    if (res.success) {
      if (res.token) {
        localStorage.setItem("via_token", res.token);
      }
      setUser(res.data.user);
      return res.data.user;
    }
    throw new Error(res.message || "Google Sign-In failed");
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Ignore
    } finally {
      localStorage.removeItem("via_token");
      setUser(null);
    }
  };

  const updateProfile = async (data) => {
    const res = await authService.updateProfile(data);
    if (res.success && res.data.user) {
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const verifyOtp = async (otp) => {
    const res = await authService.verifyEmailOtp(otp);
    if (res.success) {
      setUser((prev) => ({ ...prev, emailVerified: true }));
      return res;
    }
    throw new Error(res.message || "OTP verification failed");
  };

  const resendOtp = async () => {
    const res = await authService.resendEmailOtp();
    if (res.success) return res;
    throw new Error(res.message || "Failed to resend OTP");
  };

  const addAddress = async (addressData) => {
    const res = await authService.addAddress(addressData);
    if (res.success && res.data.addresses) {
      setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
    }
  };

  const deleteAddress = async (id) => {
    const res = await authService.deleteAddress(id);
    if (res.success && res.data.addresses) {
      setUser((prev) => ({ ...prev, addresses: res.data.addresses }));
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    register,
    googleLogin,
    logout,
    updateProfile,
    verifyOtp,
    resendOtp,
    addAddress,
    deleteAddress,
    refreshUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

